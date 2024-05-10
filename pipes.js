class Pipes {
	constructor() {
		this.x = width; // pipe x position
		this.w = 140; // pipe width
		this.h = height; // pipe height
		this.speed = 5;
		this.spacing = 275; // total gap between top and bottom pipe
		this.gapCenter = random(300, 900); // the center of the gap between top and bottom pipe
		this.topPipeY = this.gapCenter - this.spacing / 2 - height;
		this.bottomPipeY = this.gapCenter + this.spacing / 2;
		this.passed = false; // has the bird passed the pipe
	}

	move() {
		this.x -= this.speed;
	}

	// display the pipes
	show(upImg, downImg) {
		image(upImg, this.x, this.bottomPipeY, this.w, this.h);
		image(downImg, this.x, this.topPipeY, this.w, this.h);
	}

	// move pipes to the left
	update() {
		this.move();
	}

	// check if pipe is offscreen
	offScreen() {
		if (this.x < -150) {
			return true;
		} else {
			return false;
		}
	}

	// checks if bird passed pipe for bird vision
	birdPassed(bird) {
		if (bird.x > this.x + this.w && this.passed === false) {
			this.passed = true;
			return true;
		}
		return false;
	}

	// checks if bird passed pipe for score
	birdPassedForScore(bird) {
		if (bird.x + bird.width / 2 > this.x + this.w / 2 && this.passed === false) {
			this.passed = true;
			return true;
		}
		return false;
	}
}
