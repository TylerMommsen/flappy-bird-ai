class Ground {
	constructor() {
		this.x = 0;
		this.y = height - 80;
		this.speed = 5;

		this.move = () => {
			this.x -= this.speed;
		};
	}

	show() {
		fill(50, 50, 50);
		rect(this.x, this.y, 2000, 80);
	}

	update() {
		this.move();
		if (this.x <= -1000) {
			this.x = 0;
		}
	}
}
