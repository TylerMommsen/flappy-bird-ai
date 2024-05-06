let bird;
let timer = 100; // timer for spawning pipes
let pipes = [];
let ground;
let gameOver = false;
let score = 0;

// visual assets
let bg, groundImg, birdImg, pipeUpImg, pipeDownImg;
let flappyFont;
let hitSound, flapSound, pointSound, failSound;

function preload() {
	bg = loadImage("assets/bg.png");
	groundImg = loadImage("assets/ground.png");
	birdImg = loadImage("assets/bird.png");
	pipeUpImg = loadImage("assets/pipeup.png");
	pipeDownImg = loadImage("assets/pipedown.png");

	// font
	flappyFont = loadFont("assets/flappy-font.ttf");

	// sounds
	hitSound = loadSound("assets/sounds/hit-sound.wav");
	flapSound = loadSound("assets/sounds/flap-sound.mp3");
	pointSound = loadSound("assets/sounds/point-sound.mp3");
	failSound = loadSound("assets/sounds/fail-sound.mp3");
}

function setup() {
	createCanvas(1000, 1320);

	bird = new Bird(flapSound);
	ground = new Ground();
	frameRate(60);
}

function draw() {
	if (gameOver) return;

	// handle all the logic stuff
	if (timer >= 100) {
		pipes.push(new Pipes());
		timer = 0;
	}
	timer++;

	for (let i = pipes.length - 1; i > 0; i--) {
		pipes[i].update();

		if (pipes[i].collidedWithBird(bird)) {
			hitSound.play();
			setTimeout(() => {
				failSound.play();
			}, 500);
			gameOver = true;
		}

		if (pipes[i].birdPassed(bird)) {
			pointSound.play();
			score++;
		}

		if (pipes[i].offScreen()) {
			pipes.splice(i, 1);
		}
	}

	bird.update(pipes);

	if (ground.collidedWithBird(bird)) {
		hitSound.play();
		setTimeout(() => {
			failSound.play();
		}, 500);
		gameOver = true;
	}
	ground.update();

	// displaying/showing all the visual stuff
	image(bg, 0, 0, 1000, 1320); // display background

	// display pipes
	for (let i = 0; i < pipes.length; i++) {
		pipes[i].show(pipeUpImg, pipeDownImg);
	}

	// display bird and ground
	bird.show(birdImg);
	ground.show(groundImg);

	// display score
	textFont(flappyFont);
	fill(255);
	textSize(100);
	stroke(0);
	strokeWeight(12);
	textAlign(CENTER, CENTER);
	text(score, width / 2, 160);
}

function keyPressed() {
	if (key === " ") {
		bird.flap();
	}
}
