let bird;

function setup() {
	createCanvas(1000, 1320);
	background(0, 200, 255);

	bird = new Bird();
}

function draw() {
	background(0, 200, 255);
	bird.update();
	bird.show();
}
