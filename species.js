class Species {
	constructor(bird) {
		this.birds = []; // birds in this species
		this.bestFitness = 0;
		this.champion; // the best bird of this species
		this.averageFitness = 0; // average fitness of this species
		this.staleness = 0; // how many generation with no improvement
		this.benchmarkBrain;

		// coefficients for testing compatibility on whether to add to species or not
		this.excessCoeff = 1;
		this.weightDiffCoeff = 0.5;
		this.compatibilityThreshold = 3;

		if (bird) {
			this.birds.push(bird);
			this.bestFitness = bird.fitness;
			this.benchmarkBrain = bird.brain.clone();
			this.champion = bird.clone();
		}
	}

	// checks how similar a bird is to the birds of this species by comparing weights
	isSameSpecies(genome) {
		let compatibility;
		let excessAndDisjoint = this.getExcessAndDisjoint(genome, this.benchmarkBrain); // get the number of excess and disjoint genes between this bird and the current species rep
		let averageWeightDiff = this.averageWeightDiff(genome, this.benchmarkBrain); // get the average weight difference between matching genes

		let largeGenomerNormalizer = genome.connections.length - 20;
		if (largeGenomerNormalizer < 1) {
			largeGenomerNormalizer = 1;
		}

		// compatibility formula
		compatibility =
			(this.excessCoeff * excessAndDisjoint) / largeGenomerNormalizer +
			this.weightDiffCoeff * averageWeightDiff;

		return this.compatibilityThreshold > compatibility;
	}

	// returns the number of excess and disjoint connections between the 2 brains
	// (returns the number of connections which dont match)
	getExcessAndDisjoint(brain1, brain2) {
		let matching = 0.0;
		for (let i = 0; i < brain1.connections.length; i++) {
			for (let j = 0; j < brain2.connections.length; j++) {
				if (brain1.connections[i].innovationNumber === brain2.connections[j].innovationNumber) {
					matching++;
					break;
				}
			}
		}
		return brain1.connections.length + brain2.connections.length - 2 * matching;
	}

	// returns the average weight difference between matching connections in the input brains
	averageWeightDiff(brain1, brain2) {
		if (brain1.connections.length === 0 || brain2.connections.length === 0) {
			return 0;
		}

		let matching = 0;
		let totalDifference = 0;

		for (let i = 0; i < brain1.connections.length; i++) {
			for (let j = 0; j < brain2.connections.length; j++) {
				if (brain1.connections[i].innovationNumber === brain2.connections[j].innovationNumber) {
					matching++;
					totalDifference += abs(brain1.connections[i].weight - brain2.connections[j].weight);
					break;
				}
			}
		}

		if (matching === 0) {
			return 100;
		}
		return totalDifference / matching;
	}

	// pretty understandable
	addToSpecies(bird) {
		this.birds.push(bird);
	}

	// sort birds from highest to lowest fitness in the species
	sortSpecies() {
		let temp = [];

		for (let i = 0; i < this.birds.length; i++) {
			let max = 0;
			let maxIndex = 0;
			for (let j = 0; j < this.birds.length; j++) {
				if (this.birds[j].fitness > max) {
					max = this.birds[j].fitness;
					maxIndex = j;
				}
			}
			temp.push(this.birds[maxIndex]);

			this.birds.splice(maxIndex, 1);
			i--;
		}

		arrayCopy(temp, this.birds);

		if (this.birds.length === 0) {
			this.staleness = 200;
			return;
		}

		if (this.birds[0].fitness > this.bestFitness) {
			this.staleness = 0;
			this.bestFitness = this.birds[0].fitness;
			this.benchmarkBrain = this.birds[0].brain.clone();
			this.champion = this.birds[0].clone();
		} else {
			this.staleness++;
		}
	}

	// ruthlessly kill the weakest 50% of the species
	killWeakest() {
		if (this.birds.length > 2) {
			for (let i = this.birds.length / 2; i < this.birds.length; i++) {
				this.birds.splice(i, 1);
				i--;
			}
		}
	}

	// in order to protect unique birds, the fitnesses of each bird is divided by the number of birds in the species that the bird belongs to
	fitnessSharing() {
		for (let i = 0; i < this.birds.length; i++) {
			this.birds[i].fitness /= this.birds.length;
		}
	}

	// calculate the average fitness of a species
	setAverageFitness() {
		let totalFitness = 0;

		for (let i = 0; i < this.birds.length; i++) {
			totalFitness += this.birds[i].fitness;
		}

		this.averageFitness = totalFitness / this.birds.length;
	}

	// selects a bird based on it's fitness
	selectBird() {
		let fitnessSum = 0;
		for (let i = 0; i < this.birds.length; i++) {
			fitnessSum += this.birds[i].fitness;
		}

		let rand = random(fitnessSum);
		let runningSum = 0;

		for (let i = 0; i < this.birds.length; i++) {
			runningSum += this.birds[i].fitness;
			if (runningSum > rand) {
				return this.birds[i];
			}
		}

		// unreachable code
		return this.birds[0];
	}

	// create a new child (clone the bird)
	reproduce(innovationHistory) {
		let child;

		// 25% of the time there is no crossover and the child is just a clone
		if (random(1) < 0.25) {
			child = this.selectBird().clone();
		} else {
			// get 2 parents
			let parent1 = this.selectBird();
			let parent2 = this.selectBird();

			// the crossover function expects the highest fitness parent to be the object and the lowest as the argument
			if (parent1.fitness < parent2.fitness) {
				child = parent2.crossover(parent1);
			} else {
				child = parent1.crossover(parent2);
			}
		}

		child.brain.mutate(innovationHistory);
		return child;
	}
}
