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
		this.score = 0;
		this.isAlive = true;
		this.flapped = false;

		// AI properties
		this.decision = null; // decides whether should flap or not
		this.vision = [0.5, 1, 0.5]; // inputs array that will feed the network
		this.inputs = 3; // inputs size
		this.brain = new Brain(this.inputs); // brain/neural network for the bird
	}

	// apply gravity to bird
	move() {
		this.velocity += this.gravity;
		this.y += this.velocity;

		if (this.velocity >= 3) {
			this.flapped = false;
		}
	}

	// flap bird up
	flap() {
		// this.flapSound.play();
		if (this.flapped === false) {
			this.velocity = this.flapPower;
			this.flapped = true;
		}
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
		this.checkPipeCollisionOrPassed();
		this.checkGroundCollision();
	}

	// check if bird has hit a pipe
	checkPipeCollisionOrPassed() {
		for (let i = pipes.length - 1; i >= 0; i--) {
			let pipe = pipes[i];
			if (this.x + this.width > pipe.x && this.x < pipe.x + pipe.w) {
				// check top pipe
				if (this.y < pipe.topPipeY + 1320) this.isAlive = false;
				// check bottom pipe
				if (this.y + this.height > pipe.bottomPipeY) this.isAlive = false;
			} else {
				// bird did not hit pipe, now check if it passed it
				if (this.x + this.width / 2 > pipe.x + pipe.w / 2 && pipe.passed === false) {
					pipe.passed = true;
					this.score++;
				}
			}
		}
	}

	// check if bird has hit the ground
	checkGroundCollision() {
		if (this.y + this.height > ground.y) {
			this.isAlive = false;
		}
	}

	// ---- AI related stuff ----

	// the thinking process for bird, whether to flap or not
	think() {
		this.decision = this.brain.feedForward(this.vision);
		// console.log(this.decision);
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
			let birdCenterX = this.x + this.width / 2;
			let birdCenterY = this.y + this.height / 2;
			let closestPipe = this.closestPipe();

			let lineToTopPipe = closestPipe.topPipeY + 1320 - birdCenterY;
			let lineToClosestPipeX = closestPipe.x - birdCenterX;
			let lineToBottomPipe = closestPipe.bottomPipeY - birdCenterY;

			// line to top pipe
			this.vision[0] = Math.abs(lineToTopPipe) / 900;
			// line to middle of both pipes
			this.vision[1] = Math.abs(lineToClosestPipeX) / 750;
			// line to bottom pipe
			this.vision[2] = Math.abs(lineToBottomPipe) / 900;
		}
	}
}
