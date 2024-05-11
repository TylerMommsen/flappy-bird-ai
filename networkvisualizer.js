class NetworkVisualizer {
	constructor(brain, startX, startY, width, height) {
		this.brain = brain; // the neural network to visualize
		this.startX = startX; // starting x-coordinate for the visualization
		this.startY = startY; // starting y-coordinate for the visualization
		this.width = width; // width of the visualization area
		this.height = height; // height of the visualization area
	}

	// main function to handle visualization
	show(bestBird) {
		if (bestBird !== null) this.brain = bestBird.brain;
		this.calculateNodePositions(); // calculate and store positions of all nodes
		this.drawConnections(); // draw all connections between nodes
		this.drawNodes(); // draw nodes on top of connections
	}

	// calculate the positions of all nodes in the neural network
	calculateNodePositions() {
		this.nodePositions = [];
		for (let i = 0; i < this.brain.layers; i++) {
			let nodesInLayer = this.brain.nodes.filter((node) => node.layer === i); // get nodes in this layer
			let x = this.startX + ((i + 1.0) * this.width) / (this.brain.layers + 1.0); // calculate x position
			for (let j = 0; j < nodesInLayer.length; j++) {
				let y = this.startY + ((j + 1.0) * this.height) / (nodesInLayer.length + 1.0); // calculate y position
				let index = nodesInLayer[j].id; // get node number
				this.nodePositions[index] = createVector(x, y); // store position using node number as index
			}
		}
	}

	// draw connections between nodes
	drawConnections() {
		this.brain.connections.forEach((connection) => {
			if (connection.enabled) {
				let fromPos = this.nodePositions[connection.fromNode.id];
				let toPos = this.nodePositions[connection.toNode.id];
				stroke(connection.weight > 0 ? 255 : 0, 0, connection.weight <= 0 ? 255 : 0); // color code based on weight
				strokeWeight(map(abs(connection.weight), -1, 1, 1, 3)); // stroke weight based on weight
				line(fromPos.x, fromPos.y, toPos.x, toPos.y);
			}
		});
	}

	// draw nodes at their calculated positions
	drawNodes() {
		this.nodePositions.forEach((pos, index) => {
			// draw nodes
			stroke(0);
			strokeWeight(1);
			fill(255);
			ellipse(pos.x, pos.y, 40, 40);

			// draw text in nodes
			fill(0);
			noStroke();
			textFont("sans-serif");
			textStyle(BOLD);
			textSize(20);
			textAlign(CENTER, CENTER);
			text(index, pos.x, pos.y);
		});
	}
}
