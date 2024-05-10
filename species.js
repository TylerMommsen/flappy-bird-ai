class Species {
	constructor(bird) {
		this.birds = []; // birds in this species
		this.averageFitness = 0; // average fitness of this species
		this.threshold = 1.2; // value to decide if birds should be added to species or not
		this.birds.push(bird);
		this.benchmarkFitness = bird.fitness; // best bird fitness
		this.benchmarkBrain = bird.brain.clone(); // best bird brain
		this.champion = bird.clone(); // the best bird of this species
		this.staleness = 0; // how many generation with no improvement
	}

	// checks how similar a bird is to the birds of this species by comparing weights
	similarity(brain) {
		let similarity = this.weightDifference(this.benchmarkBrain, brain);
		return this.threshold > similarity;
	}

	weightDifference(brain1, brain2) {
		let totalWeightDifference = 0;
		for (let i = 0; i < brain1.connections.length; i++) {
			for (let j = 0; j < brain2.connections.length; j++) {
				if (i === j) {
					totalWeightDifference += Math.abs(
						brain1.connections[i].weight - brain2.connections[j].weight
					);
				}
			}
		}
		return totalWeightDifference;
	}

	addToSpecies(bird) {
		this.birds.push(bird);
	}

	// sort birds from highest to lowest fitness in the species
	sortBirdsByFitness() {
		this.birds.sort((a, b) => b.fitness - a.fitness);

		if (this.birds[0].fitness > this.benchmarkFitness) {
			this.staleness = 0;
			this.benchmarkFitness = this.birds[0].fitness;
			this.champion = this.birds[0].clone();
		} else {
			this.staleness += 1;
		}
	}

	// calculate the average fitness of a species
	calculateAverageFitness() {
		let totalFitness = 0;

		for (let i = 0; i < this.birds.length; i++) {
			totalFitness += this.birds[i].fitness;
		}

		if (this.birds.length > 0) {
			this.averageFitness = Math.floor(totalFitness / this.birds.length);
		} else {
			this.averageFitness = 0;
		}
	}

	// create a new child (clone the bird)
	offSpring() {
		if (this.birds.length > 1) {
			let randomBirdIndex = Math.floor(Math.random() * (this.birds.length - 1)) + 1;
			let baby = this.birds[randomBirdIndex].clone();
			baby.brain.mutate();

			return baby;
		} else {
			let baby = this.birds[0].clone();
			baby.brain.mutate();
			return baby;
		}
	}
}
