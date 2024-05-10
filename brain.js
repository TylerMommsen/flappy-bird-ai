class Brain {
	constructor(inputs, clone = false) {
		this.connections = [];
		this.nodes = [];
		this.inputs = inputs; // number of things the bird sees
		this.net = []; // stores the nodes of the neural network in the order of the layer they appear in
		this.layers = 2;

		if (clone === false) {
			this.createNodes();
			this.createConnections();
		}
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
		for (let i = 0; i < this.inputs + 1; i++) {
			this.connections.push(
				new Connection(this.nodes[i], this.nodes[this.inputs + 1], random(-1, 1))
			);
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
		// input nodes
		for (let i = 0; i < this.inputs; i++) {
			this.nodes[i].outputValue = vision[i];
		}

		// bias node
		this.nodes[this.inputs].outputValue = 1;

		for (let i = 0; i < this.net.length; i++) {
			this.net[i].activate();
		}

		// get output value from output node
		let outputValue = this.nodes[this.inputs + 1].outputValue;

		// reset all the input values
		for (let i = 0; i < this.nodes.length; i++) {
			this.nodes[i].inputValue = 0;
		}

		return outputValue;
	}

	clone() {
		let clone = new Brain(this.inputs, true);

		for (let i = 0; i < this.nodes.length; i++) {
			clone.nodes.push(this.nodes[i].clone());
		}

		// Clone connections with proper node references
		for (let connection of this.connections) {
			let fromNode = clone.getNode(connection.fromNode.id);
			let toNode = clone.getNode(connection.toNode.id);
			clone.connections.push(new Connection(fromNode, toNode, connection.weight));
		}

		clone.layers = this.layers;
		clone.connectNodes();
		clone.createNet();
		return clone;
	}

	getNode(id) {
		for (let i = 0; i < this.nodes.length; i++) {
			let node = this.nodes[i];
			if (node.id === id) {
				return node;
			}
		}
	}

	mutate() {
		if (random(1) < 0.8) {
			for (let i = 0; i < this.connections.length; i++) {
				this.connections[i].mutateWeight();
			}
		}
	}
}
