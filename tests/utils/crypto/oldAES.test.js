const AES = require('../../../utils/crypto/oldAES');

describe('AES', () => {
    it('should have a required property and method', () => {
        expect(AES).toHaveProperty('key128');
        expect(AES).toHaveProperty('encrypt');
        expect(AES).toHaveProperty('decrypt');
    });

    it('AES Key 128 should be an array of 16 bytes', () => {
        expect(AES.key128).toHaveLength(16);
    });
});

describe('AES Operation', () => {
    it('should encrypt a byte', () => {
        const encryptedByte = AES.encrypt(50, AES.key128);
        expect(typeof encryptedByte).toEqual('number');
        expect(encryptedByte).toEqual(169);
    });

    it('should decrypt a byte', () => {
        const decryptedByte = AES.decrypt(169, AES.key128);
        expect(typeof decryptedByte).toEqual('number');
        expect(decryptedByte).toEqual(50);
    });
});
