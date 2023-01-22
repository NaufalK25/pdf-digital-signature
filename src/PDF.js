const fs = require('fs');
const AES = require('./AES');
const { clearDir, createDir, deleteFile, getDirFromPath } = require('./fs-extend');

module.exports = class PDF {
    constructor(filePath = '') {
        this.filePath = filePath;
    }

    encrypt(dest) {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const encryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                encryptedData.push(AES.encrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(encryptedData));

            deleteFile(this.filePath);
        } catch (err) {
            clearDir(dir, ['.gitkeep']);
        }

        return this;
    }

    decrypt(dest) {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const decryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                decryptedData.push(AES.decrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(decryptedData));

            deleteFile(this.filePath);
        } catch (err) {
            clearDir(dir, ['.gitkeep']);
        }

        return this;
    }
};
