const aesjs = require('aes-js');

module.exports = class AES {
    static key128 = Array.from(Array(16).keys());

    /**
     * Initialization Vector
     */
    static iv = Array.from(Array(16).keys(), x => x + 21);

    /**
     * Counter
     */
    static CTR = 'CTR';
    /**
     * Cipher Block Chaining
     */
    static CBC = 'CBC';
    /**
     * Cipher Feedback
     */
    static CFB = 'CFB';
    /**
     * Output Feedback
     */
    static OFB = 'OFB';
    /**
     * Electronic Codebook
     */
    static ECB = 'ECB';
    static modes = [AES.CTR, AES.CBC, AES.CFB, AES.OFB, AES.ECB];

    static encrypt(byte, key, mode) {
        if (!AES.isValidMode(mode)) {
            return byte;
        }

        if (AES.isCTR(mode)) {
            return AES.encryptCTR(byte, key);
        } else if (AES.isCBC(mode)) {
            return AES.encryptCBC(byte, key);
        } else if (AES.isCFB(mode)) {
            return AES.encryptCFB(byte, key);
        } else if (AES.isOFB(mode)) {
            return AES.encryptOFB(byte, key);
        } else if (AES.isECB(mode)) {
            return AES.encryptECB(byte, key);
        }

        return byte;
    }

    static decrypt(byte, key, mode) {
        if (!AES.isValidMode(mode)) {
            return byte;
        }

        if (AES.isCTR(mode)) {
            return AES.decryptCTR(byte, key);
        } else if (AES.isCBC(mode)) {
            return AES.decryptCBC(byte, key);
        } else if (AES.isCFB(mode)) {
            return AES.decryptCFB(byte, key);
        } else if (AES.isOFB(mode)) {
            return AES.decryptOFB(byte, key);
        } else if (AES.isECB(mode)) {
            return AES.decryptECB(byte, key);
        }

        return byte;
    }

    static encryptCTR(byte, key) {
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const encryptedBytes = aesCtr.encrypt([byte]);
        return encryptedBytes[0];
    }

    static encryptCBC(byte, key) {
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, AES.iv);
        const encryptedBytes = aesCbc.encrypt([byte]);
        return encryptedBytes[0];
    }

    static encryptCFB(byte, key) {
        const segmentSize = 8;
        const aesCfb = new aesjs.ModeOfOperation.cfb(key, AES.iv, segmentSize);
        const encryptedBytes = aesCfb.encrypt([byte]);
        return encryptedBytes[0];
    }

    static encryptOFB(byte, key) {
        const aesOfb = new aesjs.ModeOfOperation.ofb(key, AES.iv);
        const encryptedBytes = aesOfb.encrypt([byte]);
        return encryptedBytes[0];
    }

    static encryptECB(byte, key) {
        const aesEcb = new aesjs.ModeOfOperation.ecb(key);
        const encryptedBytes = aesEcb.encrypt([byte]);
        return encryptedBytes[0];
    }

    static decryptCTR(byte, key) {
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt([byte]);
        return decryptedBytes[0];
    }

    static decryptCBC(byte, key) {
        const aesCbc = new aesjs.ModeOfOperation.cbc(key, AES.iv);
        const decryptedBytes = aesCbc.decrypt([byte]);
        return decryptedBytes[0];
    }

    static decryptCFB(byte, key) {
        const segmentSize = 8;
        const aesCfb = new aesjs.ModeOfOperation.cfb(key, AES.iv, segmentSize);
        const decryptedBytes = aesCfb.decrypt([byte]);
        return decryptedBytes[0];
    }

    static decryptOFB(byte, key) {
        const aesOfb = new aesjs.ModeOfOperation.ofb(key, AES.iv);
        const decryptedBytes = aesOfb.decrypt([byte]);
        return decryptedBytes[0];
    }

    static decryptECB(byte, key) {
        const aesEcb = new aesjs.ModeOfOperation.ecb(key);
        const decryptedBytes = aesEcb.decrypt([byte]);
        return decryptedBytes[0];
    }

    static isValidMode(mode) {
        return AES.modes.includes(mode.toUpperCase());
    }

    static isCTR(mode) {
        return mode.toUpperCase() === AES.CTR;
    }

    static isCBC(mode) {
        return mode.toUpperCase() === AES.CBC;
    }

    static isCFB(mode) {
        return mode.toUpperCase() === AES.CFB;
    }

    static isOFB(mode) {
        return mode.toUpperCase() === AES.OFB;
    }

    static isECB(mode) {
        return mode.toUpperCase() === AES.ECB;
    }
};
