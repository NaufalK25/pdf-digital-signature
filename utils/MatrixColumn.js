const { converter } = require('./converter');

class MatrixColumn {
    constructor(column) {
        this.column = column;
    }

    shiftUp() {
        this.column = this.column.slice(1).concat(this.column[0]);
        return this;
    }

    convertValue(from, to) {
        this.column = this.column.map(value => converter(value, from, to));
        return this;
    }

    xor(otherColumns) {
        const result = [];
        for (let i = 0; i < this.column.length; i++) {
            let binRow = '';
            for (let j = 0; j < otherColumns.length; j++) {
                binRow += this.column[i] ^ otherColumns[j].column[i];
            }

            result.push(binRow);
        }

        return new MatrixColumn(result);
    }

    multiply(otherColumn) {
        let result = [];
        for (let i = 0; i < this.column.length; i++) {
            result.push(this.galoisMultiplication(this.column[i], otherColumn.column[i]));
        }

        return new MatrixColumn(result);
    }

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
