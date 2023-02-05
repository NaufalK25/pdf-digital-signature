const fs = require('fs');
const path = require('path');
const AES = require('./AES');
const BLAKE2s = require('./BLAKE2s');
const { textToDec } = require('./converter');
const { addData, getData } = require('./data');

class PDF {
    /**
     * A valid PDF file starts with the following bytes: `[37, 80, 68, 70, 45, 49, 46]`
     */
    static validPDFBuffer = [37, 80, 68, 70, 45, 49, 46];

    /**
     * Empty PDF file has `967` bytes
     */
    static minPDFBufferLength = 967;

    /**
     *
     * @param {string} filePath
     */
    constructor(filePath = '') {
        this.filePath = filePath;
    }

    hash(publicKey) {
        const fileBuffer = fs.readFileSync(this.filePath);

        publicKey = publicKey.padEnd(32, ' ');

        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);
        const signature = blake2s.update(fileBuffer).hexDigest();

        return signature;
    }

    decrypt(privateKey) {
        const ciphertext = getData(path.basename(this.filePath)).checksum;
        const aes = new AES(privateKey);
        const decryptedSignature = aes.decrypt(ciphertext);

        return decryptedSignature;
    }

    /**
     * Sign the PDF file
     * @param {string} privateKey
     * @param {string} publicKey
     * @returns
     */
    sign(privateKey, publicKey) {
        const fileBuffer = fs.readFileSync(this.filePath);

        publicKey = publicKey.padEnd(32, ' ');

        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);
        const signature = blake2s.update(fileBuffer).hexDigest();

        const aes = new AES(privateKey);
        const encryptedSignature = aes.encrypt(signature);

        addData(path.basename(this.filePath), {
            checksum: encryptedSignature,
            publicKey
        });

        return this;
    }
}

module.exports = PDF;
