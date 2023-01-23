const fs = require('fs');
const path = require('path');
const AES = require('../crypto/oldAES');
const { deleteFromCloud, uploadToCloud } = require('./cloud');
const { clearDir, createDir, deleteFile } = require('./file');

module.exports = class PDF {
    constructor(filePath = '') {
        this.filePath = filePath;
    }

    async encrypt(dest) {
        const dir = path.dirname(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const encryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                encryptedData.push(AES.encrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(encryptedData));
            await uploadToCloud(dest, path.basename(dest));

            await deleteFromCloud(this.filePath);
            deleteFile(this.filePath);
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
            const decryptedData = [];

            fileBuffer.toJSON().data.forEach(byte => {
                decryptedData.push(AES.decrypt(byte, AES.key128, 'CTR'));
            });

            fs.writeFileSync(dest, Buffer.from(decryptedData));
            await uploadToCloud(dest, path.basename(dest));

            await deleteFromCloud(this.filePath);
            deleteFile(this.filePath);
        } catch (err) {
            clearDir(dir, ['.gitkeep']);
        }

        return this;
    }
};
