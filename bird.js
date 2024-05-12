class Bird {
	constructor() {
		this.x = width / 4;
		this.y = height / 2;
		this.width = 102;
		this.height = 72;
		this.velocity = 0;
		this.gravity = 1;
		this.flapPower = -17;
		this.flapSound = flapSound;
		this.fallRotation = -PI / 6;
		this.isAlive = true;

		this.pipes = [];
		this.pipeTimer = 100;
		this.pipeIndex = 0;

		// AI properties
		this.lifespan = 0; // how long the bird lived
		this.score = 0; // how many pipes past
		this.fitness = 0; // combination of lifespan and score to determine fitness

		this.decision = []; // decides whether should flap or not
		this.vision = []; // inputs array that will feed the network
		this.visualization = false; // display visualization lines for the bird vision

		this.inputs = 4; // inputs size
		this.outputs = 1; // outputs size
		this.brain = new Genome(this.inputs, this.outputs); // brain/neural network for the bird
	}

	// apply gravity to bird
	move() {
		this.velocity += this.gravity;
		this.velocity = constrain(this.velocity, -25, 25);
		this.y += this.velocity;
	}

	// flap bird up
	flap() {
		this.velocity = this.flapPower;
	}

	// display the bird
	show(birdImg) {
		for (let i = 0; i < this.pipes.length; i++) this.pipes[i].show(pipeUpImg, pipeDownImg); // pipes

		push();
		// move the origin to the bird's center
		translate(this.x + this.width / 2, this.y + this.height / 2);

		// determine rotation based on velocity
		if (this.velocity < 15) {
			this.fallRotation = -PI / 6; // upward angle
		} else if (this.velocity <= 25) {
			this.fallRotation += PI / 16; // downward angle
			this.fallRotation = constrain(this.fallRotation, -PI / 6, PI / 2);
		} else {
			this.fallRotation = PI / 2; // maximum downward angle
		}

		// apply the rotation
		rotate(this.fallRotation);

		// draw the bird image, centered on the translated origin
		imageMode(CENTER);
		image(birdImg, 0, 0, this.width, this.height);
		pop();
	}

	// update bird logic every frame
	update() {
		this.createPipes();
		this.updatePipes();
		this.lifespan += 1;
		this.move();
		this.checkPipeCollision();
		this.checkGroundCollision();
		this.checkSkyCollision();
	}

	createPipes() {
		if (this.pipeTimer >= 100) {
			this.pipes.push(new Pipes(this.pipeIndex));
			this.pipeIndex++;
			this.pipeTimer = 0;
			updatedDisplayScore = false;
		}
		this.pipeTimer++;
	}

	updatePipes() {
		// handle pipe logic, and checking if bird passed pipe
		for (let i = this.pipes.length - 1; i >= 0; i--) {
			this.pipes[i].update();

			if (this.pipes[i].birdPassedForAI(this)) {
				this.score++;
			}

			if (this.pipes[i].birdPassedForScore(this) && !updatedDisplayScore) {
				updatedDisplayScore = true;
				displayScore++;
			}
		}
	}

	// check if bird has hit a pipe
	checkPipeCollision() {
		for (let i = this.pipes.length - 1; i >= 0; i--) {
			let pipe = this.pipes[i];
			if (this.x + this.width > pipe.x && this.x < pipe.x + pipe.w) {
				// check top pipe
				if (this.y < pipe.topPipeY + 1320) {
					this.isAlive = false;
					alive--;
				}
				// check bottom pipe
				if (this.y + this.height > pipe.bottomPipeY) {
					this.isAlive = false;
					alive--;
				}
			}
		}
	}

	// check if bird has hit the ground
	checkGroundCollision() {
		if (this.y + this.height > ground.y) {
			this.isAlive = false;
			alive--;
		}
	}

	// check sky collision
	checkSkyCollision() {
		if (this.y + this.height < 0) {
			this.isAlive = false;
			alive--;
		}
	}

	// ---- AI related stuff ----

	// returns the closest pipe to the bird
	closestPipe() {
		for (let i = 0; i < this.pipes.length; i++) {
			if (this.pipes[i].passedForAI === false) {
				return this.pipes[i];
			}
		}
	}

	// gathers the inputs for the bird
	look() {
		if (this.pipes.length > 0) {
			this.vision = [];

			let closestPipe = this.closestPipe();

			let distanceToClosestPipe = abs(closestPipe.x - this.x);
			let lineToTopPipe = closestPipe.topPipeY + 1320 - this.y;
			let lineToBottomPipe = abs(this.y - closestPipe.bottomPipeY);

			let normalizedDistanceToClosestPipe = map(distanceToClosestPipe, 0, 750 + this.width, 1, 0);
			let normalizedDistanceToTopPipe = map(lineToTopPipe, 0, 847, 0, 1);
			let normalizedDistanceToBottomPipe = map(lineToBottomPipe, 0, 1097, 0, 1);

			// bird velocity
			this.vision[0] = map(this.velocity, -25, 25, -1, 1);
			// distance to closest pipe
			this.vision[1] = normalizedDistanceToClosestPipe;
			// line to top pipe
			this.vision[2] = normalizedDistanceToTopPipe;
			// line to bottom pipe
			this.vision[3] = normalizedDistanceToBottomPipe;
		}
	}

	// the thinking process for bird, whether to flap or not
	think() {
		this.decision = this.brain.feedForward(this.vision);
		if (this.decision[0] > 0.6) {
			this.flap();
		}
	}

	calculateFitness() {
		this.fitness = 1 + this.score * this.score + this.lifespan / 20.0;
	}

	clone() {
		let clone = new Bird();
		clone.brain = this.brain.clone();
		clone.fitness = this.fitness;
		clone.brain.generateNetwork();
		return clone;
	}

	crossover(parent2) {
		let child = new Bird();
		child.brain = this.brain.crossover(parent2.brain);
		child.brain.generateNetwork();
		return child;
	}
}
