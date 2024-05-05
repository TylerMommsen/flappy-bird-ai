let bird;
let timer = 100;
pipes = [];
let gameSpeed = 1;
let ground;
let gameOver = false;

function setup() {
	createCanvas(1000, 1320);
	background(0, 200, 255);

	bird = new Bird();
	ground = new Ground();
}

function draw() {
	if (gameOver) return;
	// all the logic stuff
	for (let n = 0; n < gameSpeed; n++) {
		if (timer >= 100) {
			pipes.push(new Pipes());
			timer = 0;
		}
		timer++;

		for (let i = pipes.length - 1; i > 0; i--) {
			pipes[i].update();

			if (pipes[i].collidedWithBird(bird)) {
				gameOver = true;
			}

			if (pipes[i].offScreen()) {
				pipes.splice(i, 1);
			}
		}

		bird.update();
		if (ground.collidedWithBird(bird)) gameOver = true;
		ground.update();
	}

	// displaying/showing all the stuff
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
