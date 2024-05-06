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
		this.fallRotation = -PI / 6;

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
		image(img, 0, 0, this.width, this.height);
		pop();
	}

	update() {
		this.move();
	}
}
