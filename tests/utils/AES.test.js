const AES = require('../../utils/AES');

describe('constructor method', () => {
    test('should create new AES instance and generate the key schedule', () => {
        const aes = new AES('testtesttesttest');
        expect(aes.key).toBe('testtesttesttest');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });

    test('should create new AES instance and generate the key schedule (key length less than 16)', () => {
        const aes = new AES('test');
        expect(aes.key).toBe('test            ');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });

    test('should create new AES instance and generate the key schedule (key length more than 16)', () => {
        const aes = new AES('testtesttesttesttesttesttesttest');
        expect(aes.key).toBe('testtesttesttest');
        expect(aes.key.length).toBe(16);
        expect(aes.keySchedule).toBeDefined();
    });
});

describe('encrypt method', () => {
    test('should return an encrypted string', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        expect(encrypted.length % 16).toBe(0);
    });

    test('should throw an error if plaintext length is not a multiple of 16', () => {
        const aes = new AES('test');
        expect(() => {
            aes.encrypt('testtesttest');
        }).toThrowError('Plaintext harus merupakan kelipatan dari 16 karakter');
    });
});

describe('decrypt method', () => {
    test('should return a decrypted string', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        const decrypted = aes.decrypt(encrypted);
        expect(decrypted).toBe('testtesttesttest');
    });

    test('should throw an error if ciphertext length is not a multiple of 16', () => {
        const aes = new AES('test');
        const encrypted = aes.encrypt('testtesttesttest');
        expect(() => {
            aes.decrypt(encrypted.slice(0, 12));
        }).toThrowError('Ciphertext harus merupakan kelipatan dari 16 karakter');
    });
});
