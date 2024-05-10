class Connection {
	constructor(fromNode, toNode, weight) {
		this.fromNode = fromNode;
		this.toNode = toNode;
		this.weight = weight;
	}

	// 10% chance of a large mutation and 90% chance of a small mutation
	mutateWeight() {
		if (random(1) < 0.1) {
			this.weight = random(-1, 1);
		} else {
			this.weight += randomGaussian(0, 1) / 50;

			if (this.weight > 1) this.weight = 1;
			if (this.weight < -1) this.weight = -1;
		}
	}

	// create copy of the connection
	clone(fromNode, toNode) {
		let clone = new Connection(fromNode, toNode, this.weight);
		return clone;
	}
}
