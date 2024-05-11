class Pipes {
	constructor(index) {
		this.x = width; // pipe x position
		this.w = 140; // pipe width
		this.h = height; // pipe height
		this.speed = 5;
		this.spacing = 250; // total gap between top and bottom pipe
		if (randomPipeHeights.length <= index) {
			let gapCenter = random(300, 900);
			randomPipeHeights.push(gapCenter);
		}
		this.gapCenter = randomPipeHeights[index]; // the center of the gap between top and bottom pipe
		this.topPipeY = this.gapCenter - this.spacing / 2 - 1320;
		this.bottomPipeY = this.gapCenter + this.spacing / 2;
		this.passedForAI = false; // has the bird passed the pipe
		this.passedForScore = false;
		this.passedBirds = new Set();
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

	// checks if bird passed pipe for bird vision inputs
	birdPassedForAI(bird) {
		if (bird.x > this.x + this.w && !this.passedForAI) {
			this.passedForAI = true;
			return true;
		}
		return false;
	}

	// checks if bird passed pipe for score display
	birdPassedForScore(bird) {
		if (bird.x + bird.width / 2 > this.x + this.w / 2 && this.passedForScore === false) {
			this.passedForScore = true;
			return true;
		}
		return false;
	}
}
