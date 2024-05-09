class Brain {
	constructor(inputs) {
		this.connections = [];
		this.nodes = [];
		this.inputs = inputs; // number of things the bird sees
		this.net = []; // stores the nodes of the neural network in the order of the layer they appear in
		this.layers = 2;

		this.createNodes();
		this.createConnections();
		this.createNet();
	}

	// create the nodes
	createNodes() {
		for (let i = 0; i < this.inputs; i++) {
			this.nodes.push(new Node(i));
			this.nodes[i].layer = 0;
		}

		// create bias node
		this.nodes.push(new Node(this.inputs));
		this.nodes[this.inputs].layer = 0;

		// create output node
		let outputIndex = this.inputs + 1;
		this.nodes.push(new Node(outputIndex));
		this.nodes[outputIndex].layer = 1;
	}

	// create the connections
	createConnections() {
		for (let i = 0; i < 4; i++) {
			this.connections.push(new Connection(this.nodes[i], this.nodes[4], random(-1, 1)));
		}
	}

	// connect the nodes with their connections
	connectNodes() {
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].connections = [];
		}

		for (let i = 0; i < this.connections.length; i++) {
			this.connections[i].fromNode.connections.push(this.connections[i]);
		}
	}

	// create the full neural network
	createNet() {
		this.connectNodes();
		this.net = [];

		for (let j = 0; j < this.layers; j++) {
			for (let i = 0; i < this.nodes.length; i++) {
				if (this.nodes[i].layer === j) {
					this.net.push(this.nodes[i]);
				}
			}
		}
	}

	feedForward(vision) {
		for (let i = 0; i < this.inputs; i++) {
			this.nodes[i].outputValue = vision[i];
		}

		this.nodes[3].outputValue = 1;

		for (let i = 0; i < this.net.length; i++) {
			this.net[i].activate();
		}

		let outputValue = this.nodes[4].outputValue;

		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].inputValue = 0;
		}

		return outputValue;
	}
}
