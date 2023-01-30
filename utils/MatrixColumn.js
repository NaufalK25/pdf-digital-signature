const { converter } = require('./converter');

class MatrixColumn {
    constructor(column) {
        this.column = column;
    }

    shiftUp() {
        const first = this.column[0];
        const rest = this.column.slice(1);
        return new MatrixColumn([...rest, first]);
    }

    convertValue(from, to) {
        this.column = this.column.map(value => converter(value, from, to));
        return this;
    }

    xor(otherColumns) {
        const result = [];
        for (let i = 0; i < this.column.length; i++) {
            let binRow = '';
            for (let j = 0; j < this.column[i].length; j++) {
                let xor = this.column[i][j];
                otherColumns.forEach(otherColumn => {
                    xor ^= otherColumn.column[i][j];
                });
                binRow += xor;
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

        return result;
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
