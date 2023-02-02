const fs = require('fs');
const path = require('path');
const AES = require('./AES');
const { deleteFromCloud, uploadToCloud } = require('./cloud');
const { clearDir, createDir } = require('./file');
const { decToText, textToDec } = require('./converter');

class PDF {
    /**
     * A valid PDF file starts with the following bytes: [37, 80, 68, 70, 45, 49, 46]
     */
    static validPDFBuffer = [37, 80, 68, 70, 45, 49, 46];

    constructor(filePath = '') {
        this.filePath = filePath;
        this.aes = new AES();
        this.paddingLength = 0;
    }

    async encrypt(dest) {
        const dir = path.dirname(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);

            const plaintext = fileBuffer.toJSON().data.map(decToText).join('');
            const ciphertext = this.aes.encrypt(plaintext);
            const encryptedBuffer = Buffer.from([...ciphertext].map(textToDec));
            this.paddingLength = this.aes.paddingLength;

            fs.writeFileSync(dest, encryptedBuffer);
            // await uploadToCloud(dest, path.basename(dest));

            // await deleteFromCloud(this.filePath);
            fs.unlinkSync(this.filePath);
        } catch (err) {
            clearDir(dir, ['.gitkeep']);
        }

        return this;
    }

    async decrypt(dest) {
        const dir = path.dirname(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);

            const ciphertext = fileBuffer.toJSON().data.map(decToText).join('');
            const plaintext = this.aes.decrypt(ciphertext, this.paddingLength);
            const decryptedBuffer = Buffer.from([...plaintext].map(textToDec));

            fs.writeFileSync(dest, decryptedBuffer);
            // await uploadToCloud(dest, path.basename(dest));

            // await deleteFromCloud(this.filePath);
            fs.unlinkSync(this.filePath);
        } catch (err) {
            clearDir(dir, ['.gitkeep']);
        }

        return this;
    }
}

module.exports = PDF;
