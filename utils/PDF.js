const fs = require('fs');
const path = require('path');
const AES = require('./AES');
const BLAKE2s = require('./BLAKE2s');
const { deleteFromCloud, uploadToCloud } = require('./cloud');
const { clearDir, createDir } = require('./file');
const { decToText, textToDec } = require('./converter');
const { addPublicKey } = require('./publicKey');

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
        this.aes = new AES();
        this.paddingLength = 0;
    }

    /**
     * Do AES encryption on the PDF file
     * @param {string} dest
     * @returns
     */
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
            return;
        }

        return this;
    }

    /**
     * Do AES decryption on the PDF file
     * @param {string} dest
     * @returns
     */
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
            return;
        }

        return this;
    }

    /**
     * Do BLAKE2s hashing on the PDF file
     * @param {string} publicKey
     * @param {string} dest
     */
    async hash(publicKey, dest) {
        addPublicKey(path.basename(dest), publicKey);

        const dir = path.dirname(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

            const blake2s = new BLAKE2s(publicKey.length, keyBuffer);
            const hashByte = blake2s.update(fileBuffer).digest();

            fs.writeFileSync(dest, Buffer.from(hashByte));
            // await uploadToCloud(dest, path.basename(dest));

            // await deleteFromCloud(this.filePath);
            fs.unlinkSync(this.filePath);
        } catch (err) {
            return;
        }

        return this;
    }
}

module.exports = PDF;
