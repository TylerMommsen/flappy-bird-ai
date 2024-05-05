class Pipes {
	constructor() {
		this.x = width;
		this.w = 140;
		this.h = 1320;
		this.speed = 5;
		this.spacing = 300;
		this.gapCenter = random(400, 900);
		this.topPipeY = this.gapCenter - this.spacing / 2 - 1320;
		this.bottomPipeY = this.gapCenter + this.spacing / 2;

		this.move = () => {
			this.x -= this.speed;
		};
	}

	show() {
		fill(0, 255, 0);
		rect(this.x, this.topPipeY, this.w, this.h);
		rect(this.x, this.bottomPipeY, this.w, this.h);
	}

	update() {
		this.move();
	}
}
