class Population {
	constructor(populationSize) {
		this.populationSize = populationSize;
		this.population = [];
		this.generation = 1;
		this.bestBird = null;
		this.bestScore = 0;

		this.species = [];
		this.innovationHistory = [];

		this.initializePopulation();
	}

	// create a population of birds
	initializePopulation() {
		for (let i = 0; i < this.populationSize; i++) {
			this.population.push(new Bird());
			this.population[this.population.length - 1].brain.mutate(this.innovationHistory);
			this.population[this.population.length - 1].brain.generateNetwork();
		}
	}

	// update logic for birds
	updateBirds() {
		for (let i = 0; i < this.population.length; i++) {
			let bird = this.population[i];
			if (bird.isAlive) {
				bird.look(); // get inputs for brain
				bird.think(); // use outputs from neural network
				bird.update(); // move the player
			}
		}
	}

	// display birds
	showBirds(birdImg) {
		for (let i = 0; i < this.population.length; i++) {
			let bird = this.population[i];
			if (bird.isAlive) {
				bird.show(birdImg);
			}
		}
	}

	// check if all birds are dead
	allDead() {
		let extinct = true;
		for (let bird of this.population) {
			if (bird.isAlive) {
				extinct = false;
			}
		}
		return extinct;
	}

	// pretty understandable
	setBestPlayer() {
		for (let bird of this.population) {
			if (bird.score > this.bestScore) {
				this.bestBird = bird.clone();
			}
		}
	}

	// get the total average fitness of all species together
	getAverageFitnessSum() {
		let averageSum = 0;
		for (let s of this.species) {
			averageSum += s.averageFitness;
		}
		return averageSum;
	}

	// called when all birds die
	naturalSelection() {
		this.speciate(); // sort birds into different species
		this.calculateFitness(); // calculate all birds fitness
		this.sortSpecies(); // sort all birds within a species and the species array itself by fitness
		this.killWeakest(); // Wipe out the bottom 50% of each species
		this.setBestPlayer();
		this.killStaleSpecies(); // remove species that have not improved for 12 gens
		this.killExtinctSpecies(); // kill species that can't reproduce
		this.nextGeneration(); // reproduce birds for next generation
	}

	// seperate birds into different species based on the weights of their connections
	speciate() {
		for (let i = 0; i < this.species.length; i++) {
			this.species[i].birds = [];
		}

		for (let i = 0; i < this.population.length; i++) {
			let currBird = this.population[i];

			let addToSpecies = false;
			for (let j = 0; j < this.species.length; j++) {
				let currSpecies = this.species[j];
				if (currSpecies.isSameSpecies(currBird.brain)) {
					currSpecies.addToSpecies(currBird);
					addToSpecies = true;
					break;
				}
			}

			if (addToSpecies === false) {
				this.species.push(new Species(currBird));
			}
		}
	}

	// simple stuff
	calculateFitness() {
		for (let i = 0; i < this.population.length; i++) {
			this.population[i].calculateFitness();
		}
	}

	// sorts the players within a species and the species array itself by fitness
	sortSpecies() {
		for (let s of this.species) {
			s.sortSpecies();
		}

		// sort the species array by their best birds
		let temp = [];
		for (let i = 0; i < this.species.length; i++) {
			let max = 0;
			let maxIndex = 0;
			for (let j = 0; j < this.species.length; j++) {
				if (this.species[j].bestFitness > max) {
					max = this.species[j].bestFitness;
					maxIndex = j;
				}
			}
			temp.push(this.species[maxIndex]);
			this.species.splice(maxIndex, 1);
			i--;
		}

		this.species = [];
		arrayCopy(temp, this.species);
	}

	// wipe out the weakest 50% of the population of every species
	killWeakest() {
		for (let i = 0; i < this.species.length; i++) {
			this.species[i].killWeakest();
			this.species[i].fitnessSharing();
			this.species[i].setAverageFitness();
		}
	}

	// remove species that have not improved for 12 generations
	killStaleSpecies() {
		for (let i = 2; i < this.species.length; i++) {
			if (this.species[i].staleness >= 12) {
				this.species.splice(i, 1);
				i--;
			}
		}
	}

	// if the species wont even be allocated 1 child for the next gen, then kill it
	killExtinctSpecies() {
		let averageSum = this.getAverageFitnessSum();

		for (let i = 1; i < this.species.length; i++) {
			if ((this.species[i].averageFitness / averageSum) * this.population.length < 1) {
				this.species.splice(i, 1);
				i--;
			}
		}
	}

	// create the next gen of birds! The best of the besst
	nextGeneration() {
		let averageSum = this.getAverageFitnessSum();
		let children = [];

		// clone the champion (best bird)
		for (let i = 0; i < this.species.length; i++) {
			children.push(this.species[i].champion.clone());

			let childrenPerSpecies =
				floor((this.species[i].averageFitness / averageSum) * this.population.length) - 1;

			for (let j = 0; j < childrenPerSpecies; j++) {
				children.push(this.species[i].reproduce(this.innovationHistory));
			}
		}

		// fill remaining slots
		while (children.length < this.population.length) {
			children.push(this.species[0].reproduce(this.innovationHistory));
		}

		this.population = [];

		arrayCopy(children, this.population);
		this.generation++;

		for (let i = 0; i < this.population.length; i++) {
			this.population[i].brain.generateNetwork();
		}
	}
}
