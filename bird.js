class Bird {
	constructor() {
		this.x = width / 4;
		this.y = height / 2;
		this.width = 102;
		this.height = 102;
		this.velocity = 0;
		this.gravity = 1;
		this.flapPower = -17;

		this.move = () => {
			this.velocity += this.gravity;
			this.y += this.velocity;
		};

		this.flap = () => {
			this.velocity = this.flapPower;
		};
	}

	show() {
		fill(255, 200, 0);
		noStroke();
		ellipse(this.x, this.y, this.width, this.height);
	}

	update() {
		this.move();
	}
}
