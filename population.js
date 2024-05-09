class Population {
	constructor(populationSize) {
		this.population = [];
		this.populationSize = populationSize;
	}

	initializePopulation() {
		for (let i = 0; i < this.populationSize; i++) {
			this.population.push(new Bird());
		}
	}

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

	showBirds(birdImg) {
		for (let i = 0; i < this.population.length; i++) {
			let bird = this.population[i];
			if (bird.isAlive) {
				bird.show(birdImg);
			}
		}
	}

	isExtinct() {
		let extinct = true;
		for (let bird of this.population) {
			if (bird.isAlive) {
				extinct = false;
			}
		}
		return extinct;
	}
}
