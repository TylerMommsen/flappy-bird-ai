let timer = 100; // timer for spawning pipes
let pipes = [];
let ground;
let score = 0; // displays amount of pipes passed
let populationSize = 500;
let population;
let alive = populationSize; // used to display total alive population
let gameSpeed = 1; // you get it
let visualizationMode = false; // visualizing the bird's vision

// visual assets
let bg, groundImg, birdImg, pipeUpImg, pipeDownImg;
let flappyFont;
let hitSound, flapSound, pointSound, failSound;

let generationText = document.getElementById("gen-number");
let populationCountText = document.getElementById("population-count");

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
	population.initializePopulation();
}

// main game loop
function draw() {
	image(bg, 0, 0, 1000, 1320); // display background

	for (let i = 0; i < gameSpeed; i++) {
		// handle all the logic stuff
		if (timer >= 100) {
			pipes.push(new Pipes());
			timer = 0;
		}
		timer++;

		// handle pipe logic, and checking if bird passed pipe
		for (let i = pipes.length - 1; i >= 0; i--) {
			pipes[i].update();

			if (!pipes[i].passed) {
				for (let j = 0; j < population.population.length; j++) {
					if (pipes[i].birdPassedForScore(population.population[j])) score++;
				}
			}
		}

		// if birds alive, then update, otherwise start a new generation
		if (population.isExtinct() === false) {
			population.updateBirds();
		} else {
			pipes = [];
			timer = 100;
			score = 0;
			alive = populationSize;
			population.naturalSelection();
		}

		ground.update();
	}

	// displaying/showing all the visual stuff

	if (population.isExtinct() === false) {
		population.showBirds(birdImg);
	}

	for (let i = 0; i < pipes.length; i++) pipes[i].show(pipeUpImg, pipeDownImg); // pipes
	ground.show(groundImg); // ground

	// display score
	textFont(flappyFont);
	fill(255);
	textSize(100);
	stroke(0);
	strokeWeight(12);
	textAlign(CENTER, CENTER);
	text(score, width / 2, 160);

	// display current generation and total alive
	generationText.innerHTML = "Generation: " + population.generation;
	populationCountText.innerHTML = "Population: " + alive;
}

function keyPressed() {
	// turn on lines to show bird vision
	if (key === "v") {
		visualizationMode = !visualizationMode;
		population.toggleVisualization();
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
		gameSpeed = 50;
	}
}
