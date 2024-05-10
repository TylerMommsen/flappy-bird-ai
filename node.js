class Node {
	constructor(idNumber) {
		this.id = idNumber; // num between 0 and 3 to identify nodes
		this.layer = 0; // what layer the node is on, input layer is 0, output layer is 1
		this.inputValue = 0;
		this.outputValue = 0;
		this.connections = []; // stores all outgoing connections from a node
	}

	activate() {
		const sigmoid = (x) => 1 / (1 + Math.exp(-x));

		if (this.layer === 1) {
			this.outputValue = sigmoid(this.inputValue);
		}

		for (let i = 0; i < this.connections.length; i++) {
			this.connections[i].toNode.inputValue += this.connections[i].weight * this.outputValue;
		}
	}

	clone() {
		let clone = new Node(this.id);
		clone.id = this.id;
		clone.layer = this.layer;
		return clone;
	}
}
