function sigmoid(x) {
	return 1 / (1 + Math.exp(-x));
}

function dSigmoid(y) {
	return y * (1 - y);
}

class NeuralNetwork {
	constructor(inputNodes, hiddenNodes, outputNodes) {
		this.inputNodes = inputNodes;
		this.hiddenNodes = hiddenNodes;
		this.outputNodes = outputNodes;

		this.weightsIH = new Matrix(this.hiddenNodes, this.inputNodes);
		this.weightsHO = new Matrix(this.outputNodes, this.hiddenNodes);
		this.biasH = new Matrix(this.hiddenNodes, 1);
		this.biasO = new Matrix(this.outputNodes, 1);

		this.weightsIH.randomize();
		this.weightsHO.randomize();
		this.biasH.randomize();
		this.biasO.randomize();

		this.learningRate = 0.1;
	}

	feedforward(inputArray) {
		let inputs = Matrix.fromArray(inputArray);

		let hidden = Matrix.multiply(this.weightsIH, inputs);
		hidden = Matrix.add(hidden, this.biasH);
		hidden = Matrix.map(hidden, sigmoid);

		let outputs = Matrix.multiply(this.weightsHO, hidden);
		outputs = Matrix.add(outputs, this.biasO);
		outputs = Matrix.map(outputs, sigmoid);

		return outputs.toArray();
	}

	train(inputArray, targetArray) {
		let inputs = Matrix.fromArray(inputArray);
		let targets = Matrix.fromArray(targetArray);

		let hidden = Matrix.multiply(this.weightsIH, inputs);
		hidden = Matrix.add(hidden, this.biasH);
		hidden = Matrix.map(hidden, sigmoid);

		let outputs = Matrix.multiply(this.weightsHO, hidden);
		outputs = Matrix.add(outputs, this.biasO);
		outputs = Matrix.map(outputs, sigmoid);

		let outputErrors = Matrix.subtract(targets, outputs);

		let gradients = Matrix.map(outputs, dSigmoid);
		gradients = gradients.multiply(outputErrors);
		gradients = gradients.scale(this.learningRate);

		let hiddenT = Matrix.transpose(hidden);
		let weightHODeltas = Matrix.multiply(gradients, hiddenT);

		this.weightsHO = Matrix.add(this.weightsHO, weightHODeltas);
		this.biasO = Matrix.add(this.biasO, gradients);

		let weightsHOT = Matrix.transpose(this.weightsHO);
		let hiddenErrors = Matrix.multiply(weightsHOT, outputErrors);

		let hiddenGradients = Matrix.map(hidden, dSigmoid);
		hiddenGradients = hiddenGradients.multiply(hiddenErrors);
		hiddenGradients = hiddenGradients.scale(this.learningRate);

		let inputsT = Matrix.transpose(inputs);
		let weightIHDeltas = Matrix.multiply(hiddenGradients, inputsT);

		this.weightsIH = Matrix.add(this.weightsIH, weightIHDeltas);
		this.biasH = Matrix.add(this.biasH, hiddenGradients);
	}

	copy() {
		let clone = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
		clone.weightsIH = this.weightsIH.copy();
		clone.weightsHO = this.weightsHO.copy();
		clone.biasH = this.biasH.copy();
		clone.biasO = this.biasO.copy();
		return clone;
	}

	mutate(func) {
		this.weightsIH.map(func);
		this.weightsHO.map(func);
		this.biasH.map(func);
		this.biasO.map(func);
	}
}
