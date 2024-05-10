class Bird {
	constructor(flapSound = null) {
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

		// AI properties
		this.decision = null; // decides whether should flap or not
		this.vision = [1, 0.5, 0.5, 0]; // inputs array that will feed the network
		this.inputs = 4; // inputs size
		this.brain = new Brain(this.inputs); // brain/neural network for the bird
		this.brain.createNet();
		this.lifespan = 0;
		this.fitness = 0;
		this.visualization = false; // display visualization lines for the bird vision
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
		this.move();
		this.checkPipeCollision();
		this.checkGroundCollision();
		this.checkSkyCollision();
		this.lifespan += 1;
	}

	// check if bird has hit a pipe
	checkPipeCollision() {
		for (let i = pipes.length - 1; i >= 0; i--) {
			let pipe = pipes[i];
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

	// the thinking process for bird, whether to flap or not
	think() {
		this.decision = this.brain.feedForward(this.vision);
		if (this.decision > 0.73) {
			this.flap();
		}
	}

	// returns the closest pipe to the bird
	closestPipe() {
		for (let i = 0; i < pipes.length; i++) {
			if (pipes[i].passed === false) {
				return pipes[i];
			}
		}
	}

	// gathers the inputs for the bird
	look() {
		if (pipes.length > 0) {
			let closestPipe = this.closestPipe();
			let birdCenterX = this.x + this.width / 2;
			let birdCenterY = this.y + this.height / 2;

			let distanceToClosestPipe = closestPipe.x - birdCenterX;
			let lineToTopPipe = birdCenterY - closestPipe.topPipeY + 1320;
			let lineToBottomPipe = birdCenterY - closestPipe.bottomPipeY;

			let normalizedDistanceToClosestPipe = map(distanceToClosestPipe, 301, width, 0, 1);
			let normalizedDistanceToTopPipe = map(lineToTopPipe, -36, height, 0, 1);
			let normalizedDistanceToBottomPipe = map(lineToBottomPipe, -36, height, 0, 1);
			let normalizedBirdVelocity = map(this.velocity, -25, 25, -1, 1);

			// distance to closest pipe
			this.vision[0] = normalizedDistanceToClosestPipe;
			// line to top pipe
			this.vision[1] = normalizedDistanceToTopPipe;
			// line to bottom pipe
			this.vision[2] = normalizedDistanceToBottomPipe;
			// bird's velocity
			this.vision[3] = normalizedBirdVelocity;

			if (this.visualization) {
				stroke(255, 0, 0);
				line(birdCenterX, birdCenterY, closestPipe.x, birdCenterY);
				line(birdCenterX, birdCenterY, birdCenterX, closestPipe.topPipeY + 1320);
				line(birdCenterX, birdCenterY, birdCenterX, closestPipe.bottomPipeY);
			}
		}
	}

	calculateFitness() {
		this.fitness = this.lifespan;
	}

	clone() {
		let clone = new Bird();
		clone.fitness = this.fitness;
		clone.brain = this.brain.clone();
		return clone;
	}
}
