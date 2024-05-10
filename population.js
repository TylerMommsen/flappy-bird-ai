class Population {
	constructor(populationSize) {
		this.population = [];
		this.populationSize = populationSize;
		this.generation = 1;
		this.species = [];
	}

	// create a population of birds
	initializePopulation() {
		for (let i = 0; i < this.populationSize; i++) {
			this.population.push(new Bird());
		}
	}

	// update logic for birds
	updateBirds() {
		for (let i = 0; i < this.population.length; i++) {
			let bird = this.population[i];
			if (bird.isAlive) {
				bird.look();
				bird.think();
				bird.update();
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

	// turn on visualization for bird's vision
	toggleVisualization() {
		for (let i = 0; i < this.population.length; i++) {
			let bird = this.population[i];
			bird.visualization = visualizationMode;
		}
	}

	// check if all birds are dead
	isExtinct() {
		let extinct = true;
		for (let bird of this.population) {
			if (bird.isAlive) {
				extinct = false;
			}
		}
		return extinct;
	}

	naturalSelection() {
		this.speciate(); // sort birds into different species
		this.calculateFitness(); // calculate the birds fitness
		this.killExtinctSpecies();
		this.killStaleSpecies();
		this.sortSpeciesByFitness(); // sort species by fitness
		this.nextGeneration(); // reproduce birds
		this.toggleVisualization();
	}

	// seperate birds into different species based on the weights of their connections
	speciate() {
		for (let i = 0; i < this.species.length; i++) {
			this.species[i].population = [];
		}

		for (let i = 0; i < this.population.length; i++) {
			let currBird = this.population[i];

			let addToSpecies = false;
			for (let j = 0; j < this.species.length; j++) {
				let currSpecies = this.species[j];
				if (currSpecies.similarity(currBird.brain)) {
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

	calculateFitness() {
		for (let i = 0; i < this.population.length; i++) {
			this.population[i].calculateFitness();
		}

		for (let i = 0; i < this.species.length; i++) {
			this.species[i].calculateAverageFitness();
		}
	}

	sortSpeciesByFitness() {
		for (let i = 0; i < this.species.length; i++) {
			this.species[i].sortBirdsByFitness();
		}

		this.species.sort((a, b) => b.benchmarkFitness - a.benchmarkFitness);
	}

	killExtinctSpecies() {
		let speciesBin = [];

		for (let i = 0; i < this.species; i++) {
			if (this.species[i].birds === 0) {
				speciesBin.push(this.species[i]);
			}
		}

		this.species = this.species.filter((species) => !speciesBin.includes(species));
	}

	killStaleSpecies() {
		let birdBin = [];
		let speciesBin = [];

		for (let i = 0; i < this.species.length; i++) {
			if (this.species[i].staleness >= 8) {
				if (this.species.length > speciesBin.length + 1) {
					speciesBin.push(this.species[i]);

					for (let j = 0; j < this.species[i].birds.length; j++) {
						birdBin.push(this.species[i].birds[j]);
					}
				} else {
					this.species[i].staleness = 0;
				}
			}
		}

		this.population = this.population.filter((bird) => !birdBin.includes(bird));
		this.species = this.species.filter((species) => !speciesBin.includes(species));
	}

	nextGeneration() {
		let children = [];

		// clone the champion (best bird)
		for (let i = 0; i < this.species.length; i++) {
			children.push(this.species[i].champion.clone());
		}

		// fill open bird slots with children
		let childrenPerSpecies = Math.floor(
			(this.populationSize - this.species.length) / this.species.length
		);

		for (let i = 0; i < this.species.length; i++) {
			for (let j = 0; j < childrenPerSpecies; j++) {
				children.push(this.species[i].offSpring());
			}
		}

		// fill remaining slots
		while (children.length < this.populationSize) {
			children.push(this.species[0].offSpring());
		}

		this.population = [];
		for (let i = 0; i < children.length; i++) {
			this.population.push(children[i]);
		}
		this.generation++;
	}
}
