import fs from 'fs';
import { clearDir, createDir, getDirFromPath } from './fs-extend';
import { createLog } from './log-extend';

export default class PDF {
    protected filePath: string = '';
    protected isEncrypted: boolean = false;

    constructor(filePath = '', isEncrypted = false) {
        this.filePath = filePath;
        this.isEncrypted = isEncrypted;
    }

    setFilePath(filePath: string) {
        this.filePath = filePath;
        return this;
    }

    setIsEncrypted(isEncrypted: boolean) {
        this.isEncrypted = isEncrypted;
        return this;
    }

    encrypt(dest = 'data/encrypt/encrypted.pdf') {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const encryptedData: number[] = [];

            fileBuffer.toJSON().data.forEach(byte => {
                encryptedData.push(byte + 1);
            });

            fs.writeFileSync(dest, Buffer.from(encryptedData));
            this.setIsEncrypted(true);
        } catch (err: any) {
            clearDir(dir);
            createLog(err.message);
        }

        return this;
    }

    decrypt(dest = 'data/decrypt/decrypted.pdf') {
        const dir = getDirFromPath(dest);
        try {
            createDir(dir);

            const fileBuffer = fs.readFileSync(this.filePath);
            const decryptedData: number[] = [];

            fileBuffer.toJSON().data.forEach(byte => {
                decryptedData.push(byte - 1);
            });

            fs.writeFileSync(dest, Buffer.from(decryptedData));
            this.setIsEncrypted(false);
        } catch (err: any) {
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
