const { converter } = require('./converter');

class MatrixColumn {
    /**
     * @param {any[]} column
     */
    constructor(column) {
        this.column = column;
    }

    /**
     * Shift up the values in the matrix column by 1
     * @returns
     */
    shiftUp() {
        this.column = this.column.slice(1).concat(this.column[0]);
        return this;
    }

    /**
     * Convert the matrix column values
     * @param {'dec'|'hex'|'bin'|'text'} from
     * @param {'dec'|'hex'|'bin'|'text'} to
     * @returns
     */
    convertValue(from, to) {
        this.column = this.column.map(value => converter(value, from, to));
        return this;
    }

    /**
     * Do XOR operation with another matrix column(s)
     * @param {MatrixColumn[]} otherColumns
     * @returns
     */
    xor(otherColumns) {
        const result = [];
        for (let i = 0; i < this.column.length; i++) {
            let bin = '';
            for (let j = 0; j < this.column[i].length; j++) {
                bin += otherColumns.reduce((acc, otherColumn) => acc ^ otherColumn.column[i][j], this.column[i][j]);
            }
            result.push(bin);
        }

        return new MatrixColumn(result);
    }

    /**
     * Do multiplication operation with another matrix column
     * @param {MatrixColumn} otherColumn
     * @returns
     */
    multiply(otherColumn) {
        let result = [];
        for (let i = 0; i < this.column.length; i++) {
            result.push(this.galoisMultiplication(this.column[i], otherColumn.column[i]));
        }

        return new MatrixColumn(result);
    }

    /**
     * Galois multiplication between two numbers
     * @param {number} a
     * @param {number} b
     * @returns
     */
    galoisMultiplication(a, b) {
        let res = 0;

        for (let i = 0; i < 8; i++) {
            if (b & 1) {
                res ^= a;
            }
            let hiBitSet = a & 0x80;
            a <<= 1;
            if (hiBitSet) {
                a ^= 0x1b;
            }
            b >>= 1;
        }
        return res;
    }
}

module.exports = MatrixColumn;
