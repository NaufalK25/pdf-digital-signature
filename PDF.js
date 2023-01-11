const fs = require('fs');
const { clearDir, createDir, getDirFromPath } = require('./fs-extend');
const { createLog } = require('./log-extend');

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

            const data = fs.readFileSync(this.filePath);
            const encryptedData = [];

            data.toJSON().data.forEach(byte => {
                encryptedData.push(byte + 1);
            });

            fs.writeFileSync(dest, Buffer.from(encryptedData));
            this.setIsEncrypted(true);
        } catch (err) {
            clearDir(dir);
            createLog(err.message);
        }

        return this;
    }

    decrypt(dest = 'data/decrypt/decrypted.pdf') {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const data = fs.readFileSync(this.filePath);
            const decryptedData = [];

            data.toJSON().data.forEach(byte => {
                decryptedData.push(byte - 1);
            });

            fs.writeFileSync(dest, Buffer.from(decryptedData));
            this.setIsEncrypted(false);
        } catch (err) {
            clearDir(dir);
            createLog(err.message);
        }

        return this;
    }

    toString() {
        return {
            filePath: this.filePath,
            isEncrypted: this.isEncrypted
        };
    }
};
