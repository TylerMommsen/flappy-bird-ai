class Matrix {
	constructor(rows, cols) {
		this.rows = rows;
		this.cols = cols;
		this.data = Array(rows)
			.fill()
			.map(() => Array(cols).fill(0));
	}

	// randomize matrix with random values between -1 and 1
	randomize() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[i][j] = Math.random() * 2 - 1;
			}
		}
	}

	// map a function over all elements of the matrix
	map(func) {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[i][j] = func(this.data[i][j], i, j);
			}
		}
		return this;
	}

	static map(matrix, func) {
		let result = new Matrix(matrix.rows, matrix.cols);
		for (let i = 0; i < matrix.rows; i++) {
			for (let j = 0; j < matrix.cols; j++) {
				result.data[i][j] = func(matrix.data[i][j], i, j);
			}
		}
		return result;
	}

	// matrix addition
	add(other) {
		if (other instanceof Matrix) {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] += other.data[i][j];
				}
			}
		} else {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] += other;
				}
			}
		}
		return this;
	}

	static add(a, b) {
		let result = new Matrix(a.rows, a.cols);
		for (let i = 0; i < a.rows; i++) {
			for (let j = 0; j < a.cols; j++) {
				result.data[i][j] = a.data[i][j] + b.data[i][j];
			}
		}
		return result;
	}

	// matrix subtraction
	static subtract(a, b) {
		let result = new Matrix(a.rows, a.cols);
		for (let i = 0; i < a.rows; i++) {
			for (let j = 0; j < a.cols; j++) {
				result.data[i][j] = a.data[i][j] - b.data[i][j];
			}
		}
		return result;
	}

	// matrix multiplication (dot product)
	static multiply(a, b) {
		if (a.cols !== b.rows) {
			console.error("Columns of A must match rows of B");
			return;
		}

		let result = new Matrix(a.rows, b.cols);
		for (let i = 0; i < result.rows; i++) {
			for (let j = 0; j < result.cols; j++) {
				let sum = 0;
				for (let k = 0; k < a.cols; k++) {
					sum += a.data[i][k] * b.data[k][j];
				}
				result.data[i][j] = sum;
			}
		}
		return result;
	}

	// element-wise multiplaction
	multiply(other) {
		if (other instanceof Matrix) {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] *= other.data[i][j];
				}
			}
		} else {
			for (let i = 0; i < this.rows; i++) {
				for (let j = 0; j < this.cols; j++) {
					this.data[i][j] *= other;
				}
			}
		}
		return this;
	}

	// scale matrix by a scalar
	scale(scalar) {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.data[i][j] *= scalar;
			}
		}
		return this;
	}

	static scale(matrix, scalar) {
		let result = new Matrix(matrix.rows, matrix.cols);

		for (let i = 0; i < matrix.rows; i++) {
			for (let j = 0; j < matrix.cols; j++) {
				result.data[i][j] = matrix.data[i][j] * scalar;
			}
		}

		return result;
	}

	// transpose matrix
	static transpose(matrix) {
		let result = new Matrix(matrix.cols, matrix.rows);

		for (let i = 0; i < matrix.rows; i++) {
			for (let j = 0; j < matrix.cols; j++) {
				result.data[j][i] = matrix.data[i][j];
			}
		}

		return result;
	}

	// convert array to matrix
	static fromArray(arr) {
		let matrix = new Matrix(arr.length, 1);
		for (let i = 0; i < arr.length; i++) {
			matrix.data[i][0] = arr[i];
		}
		return matrix;
	}

	// convert matrix to array
	toArray() {
		let arr = [];
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				arr.push(this.data[i][j]);
			}
		}
		return arr;
	}

	copy() {
		let copy = new Matrix(this.rows, this.cols);
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				copy.data[i][j] = this.data[i][j];
			}
		}
		return copy;
	}
}
