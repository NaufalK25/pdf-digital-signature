const fs = require('fs');
const path = require('path');
const AES = require('./AES');
const BLAKE2s = require('./BLAKE2s');
const { textToDec } = require('./converter');
const { UploadedPDF } = require('../database/models');

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

        return new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();
    }

    async decrypt(req, privateKey) {
        return new AES(privateKey).decrypt(await UploadedPDF.getChecksumByPDFName(req.user.id, path.basename(this.filePath)));
    }

    async sign(req, privateKey, publicKey) {
        const fileBuffer = fs.readFileSync(this.filePath);

        publicKey = publicKey.padEnd(32, ' ');

        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

        const signature = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();
        const encryptedSignature = new AES(privateKey).encrypt(signature);

        await UploadedPDF.updateByPDFName(req.user.id, path.basename(this.filePath), {
            isHashed: true,
            checksum: encryptedSignature,
            publicKey
        });

        return this;
    }
}

module.exports = PDF;
