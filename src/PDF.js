const fs = require('fs');
const AES = require('./AES');
const { clearDir, createDir, getDirFromPath } = require('./fs-extend');

module.exports = class PDF {
    constructor(filePath = '', isEncrypted = false) {
        this.filePath = filePath;
        this.isEncrypted = isEncrypted;
    }

    setFilePath(filePath) {
        this.filePath = filePath;
        return this;
    }

    setIsEncrypted(isEncrypted) {
        this.isEncrypted = isEncrypted;
        return this;
    }

    encrypt(dest = 'data/encrypt/encrypted.pdf') {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const encryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                // encryptedData.push(byte + 1);
                encryptedData.push(AES.encrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(encryptedData));
            this.setIsEncrypted(true);
        } catch (err) {
            clearDir(dir);
        }

        return this;
    }

    decrypt(dest = 'data/decrypt/decrypted.pdf') {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const decryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                // decryptedData.push(byte - 1);
                decryptedData.push(AES.decrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(decryptedData));
            this.setIsEncrypted(false);
        } catch (err) {
            clearDir(dir);
        }

        return this;
    }

    toString() {
        return {
            filePath: this.filePath,
            isEncrypted: this.isEncrypted
        };
    }
}
