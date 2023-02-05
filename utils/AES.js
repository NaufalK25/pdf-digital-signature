require('dotenv').config();
const Matrix = require('./Matrix');
const MatrixColumn = require('./MatrixColumn');
const { decToHex } = require('./converter');

/**
 * AES 128-bit
 */
class AES {
    /**
     * S-Box (Substitution Box)
     */
    static sBox = [
        [0x63, 0x7c, 0x77, 0x7b, 0xf2, 0x6b, 0x6f, 0xc5, 0x30, 0x01, 0x67, 0x2b, 0xfe, 0xd7, 0xab, 0x76],
        [0xca, 0x82, 0xc9, 0x7d, 0xfa, 0x59, 0x47, 0xf0, 0xad, 0xd4, 0xa2, 0xaf, 0x9c, 0xa4, 0x72, 0xc0],
        [0xb7, 0xfd, 0x93, 0x26, 0x36, 0x3f, 0xf7, 0xcc, 0x34, 0xa5, 0xe5, 0xf1, 0x71, 0xd8, 0x31, 0x15],
        [0x04, 0xc7, 0x23, 0xc3, 0x18, 0x96, 0x05, 0x9a, 0x07, 0x12, 0x80, 0xe2, 0xeb, 0x27, 0xb2, 0x75],
        [0x09, 0x83, 0x2c, 0x1a, 0x1b, 0x6e, 0x5a, 0xa0, 0x52, 0x3b, 0xd6, 0xb3, 0x29, 0xe3, 0x2f, 0x84],
        [0x53, 0xd1, 0x00, 0xed, 0x20, 0xfc, 0xb1, 0x5b, 0x6a, 0xcb, 0xbe, 0x39, 0x4a, 0x4c, 0x58, 0xcf],
        [0xd0, 0xef, 0xaa, 0xfb, 0x43, 0x4d, 0x33, 0x85, 0x45, 0xf9, 0x02, 0x7f, 0x50, 0x3c, 0x9f, 0xa8],
        [0x51, 0xa3, 0x40, 0x8f, 0x92, 0x9d, 0x38, 0xf5, 0xbc, 0xb6, 0xda, 0x21, 0x10, 0xff, 0xf3, 0xd2],
        [0xcd, 0x0c, 0x13, 0xec, 0x5f, 0x97, 0x44, 0x17, 0xc4, 0xa7, 0x7e, 0x3d, 0x64, 0x5d, 0x19, 0x73],
        [0x60, 0x81, 0x4f, 0xdc, 0x22, 0x2a, 0x90, 0x88, 0x46, 0xee, 0xb8, 0x14, 0xde, 0x5e, 0x0b, 0xdb],
        [0xe0, 0x32, 0x3a, 0x0a, 0x49, 0x06, 0x24, 0x5c, 0xc2, 0xd3, 0xac, 0x62, 0x91, 0x95, 0xe4, 0x79],
        [0xe7, 0xc8, 0x37, 0x6d, 0x8d, 0xd5, 0x4e, 0xa9, 0x6c, 0x56, 0xf4, 0xea, 0x65, 0x7a, 0xae, 0x08],
        [0xba, 0x78, 0x25, 0x2e, 0x1c, 0xa6, 0xb4, 0xc6, 0xe8, 0xdd, 0x74, 0x1f, 0x4b, 0xbd, 0x8b, 0x8a],
        [0x70, 0x3e, 0xb5, 0x66, 0x48, 0x03, 0xf6, 0x0e, 0x61, 0x35, 0x57, 0xb9, 0x86, 0xc1, 0x1d, 0x9e],
        [0xe1, 0xf8, 0x98, 0x11, 0x69, 0xd9, 0x8e, 0x94, 0x9b, 0x1e, 0x87, 0xe9, 0xce, 0x55, 0x28, 0xdf],
        [0x8c, 0xa1, 0x89, 0x0d, 0xbf, 0xe6, 0x42, 0x68, 0x41, 0x99, 0x2d, 0x0f, 0xb0, 0x54, 0xbb, 0x16]
    ];

    /**
     * Inverse S-Box (Inverse Substitution Box)
     */
    static invSBox = [
        [0x52, 0x09, 0x6a, 0xd5, 0x30, 0x36, 0xa5, 0x38, 0xbf, 0x40, 0xa3, 0x9e, 0x81, 0xf3, 0xd7, 0xfb],
        [0x7c, 0xe3, 0x39, 0x82, 0x9b, 0x2f, 0xff, 0x87, 0x34, 0x8e, 0x43, 0x44, 0xc4, 0xde, 0xe9, 0xcb],
        [0x54, 0x7b, 0x94, 0x32, 0xa6, 0xc2, 0x23, 0x3d, 0xee, 0x4c, 0x95, 0x0b, 0x42, 0xfa, 0xc3, 0x4e],
        [0x08, 0x2e, 0xa1, 0x66, 0x28, 0xd9, 0x24, 0xb2, 0x76, 0x5b, 0xa2, 0x49, 0x6d, 0x8b, 0xd1, 0x25],
        [0x72, 0xf8, 0xf6, 0x64, 0x86, 0x68, 0x98, 0x16, 0xd4, 0xa4, 0x5c, 0xcc, 0x5d, 0x65, 0xb6, 0x92],
        [0x6c, 0x70, 0x48, 0x50, 0xfd, 0xed, 0xb9, 0xda, 0x5e, 0x15, 0x46, 0x57, 0xa7, 0x8d, 0x9d, 0x84],
        [0x90, 0xd8, 0xab, 0x00, 0x8c, 0xbc, 0xd3, 0x0a, 0xf7, 0xe4, 0x58, 0x05, 0xb8, 0xb3, 0x45, 0x06],
        [0xd0, 0x2c, 0x1e, 0x8f, 0xca, 0x3f, 0x0f, 0x02, 0xc1, 0xaf, 0xbd, 0x03, 0x01, 0x13, 0x8a, 0x6b],
        [0x3a, 0x91, 0x11, 0x41, 0x4f, 0x67, 0xdc, 0xea, 0x97, 0xf2, 0xcf, 0xce, 0xf0, 0xb4, 0xe6, 0x73],
        [0x96, 0xac, 0x74, 0x22, 0xe7, 0xad, 0x35, 0x85, 0xe2, 0xf9, 0x37, 0xe8, 0x1c, 0x75, 0xdf, 0x6e],
        [0x47, 0xf1, 0x1a, 0x71, 0x1d, 0x29, 0xc5, 0x89, 0x6f, 0xb7, 0x62, 0x0e, 0xaa, 0x18, 0xbe, 0x1b],
        [0xfc, 0x56, 0x3e, 0x4b, 0xc6, 0xd2, 0x79, 0x20, 0x9a, 0xdb, 0xc0, 0xfe, 0x78, 0xcd, 0x5a, 0xf4],
        [0x1f, 0xdd, 0xa8, 0x33, 0x88, 0x07, 0xc7, 0x31, 0xb1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xec, 0x5f],
        [0x60, 0x51, 0x7f, 0xa9, 0x19, 0xb5, 0x4a, 0x0d, 0x2d, 0xe5, 0x7a, 0x9f, 0x93, 0xc9, 0x9c, 0xef],
        [0xa0, 0xe0, 0x3b, 0x4d, 0xae, 0x2a, 0xf5, 0xb0, 0xc8, 0xeb, 0xbb, 0x3c, 0x83, 0x53, 0x99, 0x61],
        [0x17, 0x2b, 0x04, 0x7e, 0xba, 0x77, 0xd6, 0x26, 0xe1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0c, 0x7d]
    ];

    /**
     * Round Constant
     */
    static rCon = [
        [0x00, 0x00, 0x00, 0x00],
        [0x01, 0x00, 0x00, 0x00],
        [0x02, 0x00, 0x00, 0x00],
        [0x04, 0x00, 0x00, 0x00],
        [0x08, 0x00, 0x00, 0x00],
        [0x10, 0x00, 0x00, 0x00],
        [0x20, 0x00, 0x00, 0x00],
        [0x40, 0x00, 0x00, 0x00],
        [0x80, 0x00, 0x00, 0x00],
        [0x1b, 0x00, 0x00, 0x00],
        [0x36, 0x00, 0x00, 0x00]
    ];

    /**
     * Mix Columns Matrix
     */
    static mixColumnsMatrix = [
        [0x02, 0x03, 0x01, 0x01],
        [0x01, 0x02, 0x03, 0x01],
        [0x01, 0x01, 0x02, 0x03],
        [0x03, 0x01, 0x01, 0x02]
    ];

    /**
     * Inverse Mix Columns Matrix
     */
    static invMixColumnsMatrix = [
        [0x0e, 0x0b, 0x0d, 0x09],
        [0x09, 0x0e, 0x0b, 0x0d],
        [0x0d, 0x09, 0x0e, 0x0b],
        [0x0b, 0x0d, 0x09, 0x0e]
    ];

    constructor(key = this.padKey(process.env.AES_KEY)) {
        this.key = this.padKey(key);
        this.keySchedule = this.keyExpansion();
    }

    /**
     * Pads the key to 16 characters
     * @param {string} key
     * @returns
     */
    padKey(key) {
        if (key.length < 16) {
            return key.padEnd(16, ' ');
        }

        if (key.length > 16) {
            return key.slice(0, 16);
        }

        return key;
    }

    /**
     * Sub bytes with AES S-Box
     * @param {number} byte
     * @returns
     */
    subBytes(byte) {
        const [row, col] = byte
            .toString()
            .split('')
            .map(number => parseInt(number, 16));
        return decToHex(AES.sBox[row][col]);
    }

    /**
     * Sub bytes with AES Inverse S-Box
     * @param {number} byte
     * @returns
     */
    invSubBytes(byte) {
        const [row, col] = byte
            .toString()
            .split('')
            .map(number => parseInt(number, 16));
        return decToHex(AES.invSBox[row][col]);
    }

    /**
     * Generate key schedule
     * @returns {string[][]}
     */
    keyExpansion() {
        const keyHexMatrix = Matrix.createFromText(this.key).convertValue('dec', 'hex').matrix;
        let keySchedule = [...keyHexMatrix, ...Array(40).fill([])];
        let roundKey = 1;

        keySchedule.forEach((_, index) => {
            const ignoredIndex = [0, 1, 2, 3];

            if (ignoredIndex.includes(index)) {
                return;
            } else if (index % 4 === 0) {
                const lastColOfMatrix = new MatrixColumn(keySchedule[index - 1]).shiftUp().column.map(this.subBytes);

                const binLastColOfMatrix = new MatrixColumn(lastColOfMatrix).convertValue('hex', 'bin');
                const binFirstColOfMatrix = new MatrixColumn(keySchedule[index - 4]).convertValue('hex', 'bin');
                const binFirstColOfRCon = new MatrixColumn(AES.rCon[roundKey]).convertValue('dec', 'bin');

                keySchedule[index] = binLastColOfMatrix.xor([binFirstColOfMatrix, binFirstColOfRCon]).convertValue('bin', 'hex').column;
                roundKey++;
                return;
            } else {
                const prevCol = new MatrixColumn(keySchedule[index - 1]).convertValue('hex', 'bin');
                const prevColMin4 = new MatrixColumn(keySchedule[index - 4]).convertValue('hex', 'bin');

                keySchedule[index] = prevCol.xor([prevColMin4]).convertValue('bin', 'hex').column;
                return;
            }
        });

        return keySchedule.reduce((acc, col, index) => {
            const colIndex = Math.floor(index / 4);

            if (acc[colIndex]) {
                acc[colIndex].push(col);
            } else {
                acc[colIndex] = [col];
            }

            return acc;
        }, []);
    }

    /**
     * @param {string} plaintext
     * @returns {string[][]}
     */
    initialAddRoundKeyRound(plaintext) {
        const keyHexMatrix = Matrix.createFromText(this.key).transpose().convertValue('dec', 'bin');
        return Matrix.createFromText(plaintext).transpose().convertValue('dec', 'bin').xor(keyHexMatrix).convertValue('bin', 'hex').matrix;
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    subBytesRound(hexMatrix) {
        return hexMatrix.map(row => row.map(this.subBytes));
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    shiftRowsRound(hexMatrix) {
        return hexMatrix.map((row, index) => {
            const shiftedRow = [];
            for (let i = 0; i < row.length; i++) {
                shiftedRow.push(row[(i + index) % row.length]);
            }

            return shiftedRow;
        });
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    mixColumnsRound(hexMatrix) {
        const mixedColumns = [];
        const matrix = new Matrix(hexMatrix).transpose().matrix;

        for (let i = 0; i < AES.mixColumnsMatrix.length; i++) {
            let mixedColumn = [];
            for (let j = 0; j < matrix.length; j++) {
                mixedColumn.push([matrix[j], AES.mixColumnsMatrix[i]]);
            }

            mixedColumns.push(mixedColumn);
        }

        const mixedMatrix = [];
        for (let i = 0; i < mixedColumns.length; i++) {
            let mixedMatrixRow = [];
            for (let j = 0; j < mixedColumns[i].length; j++) {
                let [matrixCol, mixMatrixCol] = mixedColumns[i][j];
                matrixCol = new MatrixColumn(matrixCol).convertValue('hex', 'dec');
                mixMatrixCol = new MatrixColumn(mixMatrixCol);
                let galoisMult = decToHex(matrixCol.multiply(mixMatrixCol).column.reduce((acc, curr) => acc ^ curr, 0));

                if (galoisMult.length > 2) {
                    galoisMult = galoisMult.slice(-2);
                }

                mixedMatrixRow.push(galoisMult);
            }
            mixedMatrix.push(mixedMatrixRow);
        }

        return mixedMatrix;
    }

    /**
     * @param {string[][]} hexMatrix
     * @param {number} roundKey
     * @returns {string[][]}
     */
    addRoundKeyRound(hexMatrix, roundKey) {
        const nthRoundKeySchedule = this.keySchedule[roundKey];
        const nthRoundKeyMatrix = new Matrix(nthRoundKeySchedule).transpose().convertValue('hex', 'bin');
        return new Matrix(hexMatrix).convertValue('hex', 'bin').xor(nthRoundKeyMatrix).convertValue('bin', 'hex').matrix;
    }

    /**
     * @param {string[][]} matrix
     * @param {number} roundKey
     * @returns
     */
    encryptRound(matrix, roundKey) {
        const subBytesResult = this.subBytesRound(matrix);
        const shiftRowsResult = this.shiftRowsRound(subBytesResult);

        if (roundKey === 10) {
            return this.addRoundKeyRound(shiftRowsResult, roundKey);
        }

        const mixColumnsResult = this.mixColumnsRound(shiftRowsResult);
        return this.addRoundKeyRound(mixColumnsResult, roundKey);
    }

    /**
     * Encrypt a plaintext using the AES algorithm
     * @param {string} plaintext
     * @returns
     */
    encrypt(plaintext) {
        const plainArr = [...plaintext].map(char => char);

        const plainArr16 = [];
        for (let i = 0; i < plainArr.length; i += 16) {
            plainArr16.push(plainArr.slice(i, i + 16).join(''));
        }

        return plainArr16
            .map(block => {
                const initialAddRoundKeyResult = this.initialAddRoundKeyRound(block);
                let roundResult = initialAddRoundKeyResult;

                for (let i = 1; i <= 10; i++) {
                    roundResult = this.encryptRound(roundResult, i);
                }

                return new Matrix(roundResult).transpose().convertValue('hex', 'text').flat().matrix.join('');
            })
            .join('');
    }

    /**
     * @param {string} ciphertext
     * @returns {string[][]}
     */
    initialInvAddRoundKeyRound(ciphertext) {
        const lastRoundKeyMatrix = new Matrix(this.keySchedule[10]).transpose().convertValue('hex', 'bin');
        return Matrix.createFromText(ciphertext).transpose().convertValue('dec', 'bin').xor(lastRoundKeyMatrix).convertValue('bin', 'hex').matrix;
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    invShiftRowsRound(hexMatrix) {
        return hexMatrix.map((row, index) => {
            const shiftedRow = [];
            for (let i = 0; i < row.length; i++) {
                shiftedRow.push(row[(i - index + row.length) % row.length]);
            }

            return shiftedRow;
        });
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    invSubBytesRound(hexMatrix) {
        return hexMatrix.map(row => row.map(this.invSubBytes));
    }

    /**
     * @param {string[][]} hexMatrix
     * @returns
     */
    invMixColumnsRound(hexMatrix) {
        const mixedColumns = [];
        const matrix = new Matrix(hexMatrix).transpose().matrix;

        for (let i = 0; i < AES.invMixColumnsMatrix.length; i++) {
            let mixedColumn = [];
            for (let j = 0; j < matrix.length; j++) {
                mixedColumn.push([matrix[j], AES.invMixColumnsMatrix[i]]);
            }

            mixedColumns.push(mixedColumn);
        }

        const mixedMatrix = [];
        for (let i = 0; i < mixedColumns.length; i++) {
            let mixedMatrixRow = [];
            for (let j = 0; j < mixedColumns[i].length; j++) {
                let [matrixCol, mixMatrixCol] = mixedColumns[i][j];
                matrixCol = new MatrixColumn(matrixCol).convertValue('hex', 'dec');
                mixMatrixCol = new MatrixColumn(mixMatrixCol);
                let galoisMult = decToHex(matrixCol.multiply(mixMatrixCol).column.reduce((acc, curr) => acc ^ curr, 0));

                if (galoisMult.length > 2) {
                    galoisMult = galoisMult.slice(-2);
                }

                mixedMatrixRow.push(galoisMult);
            }
            mixedMatrix.push(mixedMatrixRow);
        }

        return mixedMatrix;
    }

    /**
     * @param {string[][]} matrix
     * @param {number} roundKey
     * @returns
     */
    decryptRound(matrix, roundKey) {
        const invShiftRowsResult = this.invShiftRowsRound(matrix);
        const invSubBytesResult = this.invSubBytesRound(invShiftRowsResult);
        const invAddRoundKeyResult = this.addRoundKeyRound(invSubBytesResult, roundKey);

        if (roundKey === 0) {
            return invAddRoundKeyResult;
        }

        return this.invMixColumnsRound(invAddRoundKeyResult);
    }

    /**
     * Decrypts a ciphertext using the AES algorithm
     * @param {string} ciphertext
     * @returns
     */
    decrypt(ciphertext) {
        const cipherArr = [...ciphertext].map(char => char);

        const cipherArr16 = [];
        for (let i = 0; i < cipherArr.length; i += 16) {
            cipherArr16.push(cipherArr.slice(i, i + 16).join(''));
        }

        return cipherArr16
            .map(block => {
                if (block.length % 16 !== 0) {
                    throw new Error('Ciphertext must be a multiple of 16 characters');
                }

                const initialInvAddRoundKeyResult = this.initialInvAddRoundKeyRound(block);
                let roundResult = initialInvAddRoundKeyResult;
                for (let i = 9; i >= 0; i--) {
                    roundResult = this.decryptRound(roundResult, i);
                }
                return new Matrix(roundResult).transpose().convertValue('hex', 'text').flat().matrix.join('');
            })
            .join('');
    }
}

module.exports = AES;
