const AES = require('../../utils/AES');

describe('constructor', () => {
    test('default', () => {
        const aes = new AES('testtesttesttest');
        expect(aes.key).toBe('testtesttesttest');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });

    test('key length less than 16', () => {
        const aes = new AES('test');
        expect(aes.key).toBe('test            ');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });

    test('key length more than 16', () => {
        const aes = new AES('testtesttesttesttesttesttesttest');
        expect(aes.key).toBe('testtesttesttest');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });
});

describe('encrypt', () => {
    test('success', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        expect(encrypted.length % 16).toBe(0);
    });

    test('error', () => {
        const aes = new AES('test');
        expect(() => {
            aes.encrypt('testtesttest');
        }).toThrowError('Plaintext must be a multiple of 16 characters');
    });
});

describe('decrypt', () => {
    test('success', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        const decrypted = aes.decrypt(encrypted);
        expect(decrypted).toBe('testtesttesttest');
    });

    test('error', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        expect(() => {
            aes.decrypt(encrypted.slice(0, 12));
        }).toThrowError('Ciphertext must be a multiple of 16 characters');
    });
});
