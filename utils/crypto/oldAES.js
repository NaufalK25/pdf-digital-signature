const aesjs = require('aes-js');

module.exports = class AES {
    static key128 = Array.from(Array(16).keys());

    static encrypt(byte, key) {
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const encryptedBytes = aesCtr.encrypt([byte]);
        return encryptedBytes[0];
    }

    static decrypt(byte, key) {
        const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
        const decryptedBytes = aesCtr.decrypt([byte]);
        return decryptedBytes[0];
    }
};
