class Bird {
	constructor(flapSound) {
		this.x = width / 4;
		this.y = height / 2;
		this.width = 102;
		this.height = 72;
		this.velocity = 0;
		this.gravity = 1;
		this.flapPower = -17;
		this.flapSound = flapSound;

		// move bird down
		this.move = () => {
			this.velocity += this.gravity;
			this.y += this.velocity;
		};

		// flap bird up
		this.flap = () => {
			this.flapSound.play();
			this.velocity = this.flapPower;
		};
	}

	show(img) {
		image(img, this.x, this.y, this.width, this.height);
	}

	update() {
		this.move();
	}
}
