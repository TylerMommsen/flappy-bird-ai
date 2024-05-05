class Pipes {
	constructor() {
		this.x = width; // pipe x position
		this.w = 140; // pipe width
		this.h = 1320; // pipe height
		this.speed = 5;
		this.spacing = 300; // total gap between top and bottom pipe
		this.gapCenter = random(400, 900); // the center of the gap between top and bottom pipe
		this.topPipeY = this.gapCenter - this.spacing / 2 - 1320;
		this.bottomPipeY = this.gapCenter + this.spacing / 2;
		this.passed; // has the bird passed the pipe

		this.move = () => {
			this.x -= this.speed;
		};
	}

	// display the pipes
	show() {
		fill(0, 255, 0);
		rect(this.x, this.topPipeY, this.w, this.h);
		rect(this.x, this.bottomPipeY, this.w, this.h);
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
		if (bird.x + bird.width / 2 > this.x && bird.x - bird.width / 2 < this.x + this.w) {
			// check top pipe
			if (bird.y - bird.height / 2 < this.topPipeY + 1320) return true;
			// check bottom pipe
			if (bird.y + bird.height / 2 > this.bottomPipeY) return true;
		} else {
			return false;
		}
	}
}
