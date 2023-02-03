const { converter } = require('./converter');

/**
 * 2D Matrix
 */
class Matrix {
    /**
     * @param {any[][]} matrix
     */
    constructor(matrix) {
        this.matrix = matrix;
        this.width = matrix[0].length;
        this.height = matrix.length;
    }

    /**
     * Create matrix from text
     * @param {string} text
     * @returns
     */
    static createFromText(text) {
        const matrix = [];

        for (let i = 0; i < text.length; i += 4) {
            const row = [];
            for (let j = 0; j < 4; j++) {
                row.push(text.charCodeAt(i + j));
            }
            matrix.push(row);
        }

        return new Matrix(matrix);
    }

    /**
     * Transpose the matrix
     * @returns
     */
    transpose() {
        this.matrix = this.matrix[0].map((_, colIndex) => this.matrix.map(row => row[colIndex]));
        return this;
    }

    /**
     * Flatten the matrix from 2D to 1D
     * @returns
     */
    flat() {
        const result = [];
         this.matrix.forEach(row => row.forEach(value => result.push(value)));
         this.matrix = result;
        return this;
    }

    /**
     * Convert the matrix values
     * @param {'dec'|'hex'|'bin'|'text'} from
     * @param {'dec'|'hex'|'bin'|'text'} to
     * @returns
     */
    convertValue(from, to) {
        this.matrix = this.matrix.map(row => row.map(value => converter(value, from, to)));
        return this;
    }

    /**
     * Do XOR operation with another matrix
     * @param {Matrix} otherMatrix
     * @returns
     */
    xor(otherMatrix) {
        const result = [];
        for (let i = 0; i < this.height; i++) {
            const row = [];
            for (let j = 0; j < this.width; j++) {
                const matrixBits = this.matrix[i][j].split('');
                const otherMatrixBits = otherMatrix.matrix[i][j].split('');

                const xorBits = matrixBits.map((bit, index) => {
                    return bit ^ otherMatrixBits[index];
                });

                row.push(xorBits.join(''));
            }
            result.push(row);
        }

        return new Matrix(result);
    }
}

module.exports = Matrix;
