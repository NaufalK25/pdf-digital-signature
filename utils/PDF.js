const fs = require('fs');
const path = require('path');
const AES = require('./AES');
const BLAKE2s = require('./BLAKE2s');
const { rootDir } = require('./constant');
const { textToDec } = require('./converter');
const { addData, getData } = require('./data');

class PDF {
    static validPDFBuffer = [37, 80, 68, 70, 45, 49, 46];
    static minPDFBufferLength = 967;

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

    decrypt(privateKey, decryptOption = { jsonPath: path.join(rootDir, 'data', 'data.json') }) {
        const ciphertext = getData(path.basename(this.filePath), decryptOption.jsonPath).checksum;
        const aes = new AES(privateKey);
        const decryptedSignature = aes.decrypt(ciphertext);

        return decryptedSignature;
    }

    sign(privateKey, publicKey, signOption = { jsonPath: path.join(rootDir, 'data', 'data.json') }) {
        const fileBuffer = fs.readFileSync(this.filePath);

        publicKey = publicKey.padEnd(32, ' ');

        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);
        const signature = blake2s.update(fileBuffer).hexDigest();

        const aes = new AES(privateKey);
        const encryptedSignature = aes.encrypt(signature);

        addData(
            path.basename(this.filePath),
            {
                checksum: encryptedSignature,
                publicKey
            },
            signOption.jsonPath
        );

        return this;
    }
}

module.exports = PDF;
