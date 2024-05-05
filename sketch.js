let bird;
let timer = 0;
pipes = [];
let gameSpeed = 1;
let ground;

function setup() {
	createCanvas(1000, 1320);
	background(0, 200, 255);

	bird = new Bird();
	ground = new Ground();
}

function draw() {
	for (let n = 0; n < gameSpeed; n++) {
		if (timer >= 100) {
			pipes.push(new Pipes());
			timer = 0;
		}
		timer++;

		for (let i = 0; i < pipes.length; i++) {
			pipes[i].update();
		}

		bird.update();
		ground.update();
	}

	background(0, 200, 255);

	for (let i = 0; i < pipes.length; i++) {
		pipes[i].show();
	}

	bird.show();
	ground.show();
}

function keyPressed() {
	if (key === " ") {
		bird.flap();
	}
}
