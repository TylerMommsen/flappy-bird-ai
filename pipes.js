class Pipes {
	constructor() {
		this.x = width; // pipe x position
		this.w = 140; // pipe width
		this.h = 1320; // pipe height
		this.speed = 5;
		this.spacing = 250; // total gap between top and bottom pipe
		this.gapCenter = random(300, 900); // the center of the gap between top and bottom pipe
		this.topPipeY = this.gapCenter - this.spacing / 2 - 1320;
		this.bottomPipeY = this.gapCenter + this.spacing / 2;
		this.passed = false; // has the bird passed the pipe

		this.move = () => {
			this.x -= this.speed;
		};
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

	// checks to see if pipe has collided with the bird
	collidedWithBird(bird) {
		if (bird.x + bird.width > this.x && bird.x < this.x + this.w) {
			// check top pipe
			if (bird.y < this.topPipeY + 1320) return true;
			// check bottom pipe
			if (bird.y + bird.height > this.bottomPipeY) return true;
		} else {
			return false;
		}
	}

	// checks if bird passed pipe
	birdPassed(bird) {
		if (bird.x + bird.width / 2 > this.x + this.w / 2 && this.passed === false) {
			this.passed = true;
			return true;
		}
		return false;
	}
}
