let ground;
let displayScore = 0; // displays amount of pipes passed
let updatedDisplayScore = false;
let populationSize = 100;
let population;
let alive = populationSize; // used to display total alive population
let gameSpeed = 1; // you get it
let nextConnectionNumber = 1000;
let randomPipeHeights = [];
let networkVisualizer;
let displayVisuals = true;

// visual assets
let bg, groundImg, birdImg, pipeUpImg, pipeDownImg;
let flappyFont;
let hitSound, flapSound, pointSound, failSound;

function preload() {
	// images
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

// runs on startup
function setup() {
	createCanvas(1000, 1320);
	ground = new Ground();
	frameRate(60);

	population = new Population(populationSize);
	networkVisualizer = new NetworkVisualizer(population.population[0].brain, 250, 400, 600, 500);
}

// main game loop
function draw() {
	image(bg, 0, 0, 1000, 1320); // display background
	if (displayVisuals) {
		networkVisualizer.show(population.bestBird);
	}

	for (let i = 0; i < gameSpeed; i++) {
		// if birds alive, then update, otherwise start a new generation
		if (population.allDead() === false) {
			population.updateBirds();
		} else {
			randomPipeHeights = [];
			timer = 100;
			displayScore = 0;
			alive = populationSize;
			population.naturalSelection();
		}

		ground.update();
	}

	// displaying/showing all the visual stuff

	if (population.allDead() === false) {
		population.showBirds(birdImg);
	}

	ground.show(groundImg); // ground

	// display score
	textFont(flappyFont);
	fill(255);
	textSize(100);
	stroke(0);
	strokeWeight(12);
	textAlign(CENTER, CENTER);
	text(displayScore, width / 2, 160);
	if (displayVisuals) {
		textFont("sans-serif");
		textSize(50);
		noStroke();
		textAlign(LEFT);
		textStyle(BOLD);
		text("Generation: " + population.generation, 30, 60);
		text("Population: " + alive, 30, 140);
	}
}

function keyPressed() {
	// turn on lines to show bird vision
	if (key === "v") {
		displayVisuals = !displayVisuals;
	}

	// change game speed
	if (key === "q") {
		gameSpeed = 1;
	}
	if (key === "w") {
		gameSpeed = 2;
	}
	if (key === "e") {
		gameSpeed = 5;
	}
	if (key === "r") {
		gameSpeed = 10;
	}
	if (key === "t") {
		gameSpeed = 30;
	}
	if (key === "y") {
		gameSpeed = 650;
	}
}
