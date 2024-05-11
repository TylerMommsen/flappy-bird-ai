class Ground {
	constructor() {
		this.x = 0;
		this.y = height - 160;
		this.speed = 5;

		this.move = () => {
			this.x -= this.speed;
		};
	}

	show(img) {
		image(img, this.x, this.y, 2000, 160);
	}

	// move the ground to the left and reset the position when it has reached halfway through it's width
	update() {
		this.move();
		if (this.x <= -1000) {
			this.x = 0;
		}
	}
}
