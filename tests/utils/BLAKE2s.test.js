const BLAKE2s = require('../../utils/BLAKE2s');
const { textToDec } = require('../../utils/converter');

describe('constructor method', () => {
    describe('digest length', () => {
        test('should create new BLAKE2s instance even if digest length is not specified', () => {
            expect(new BLAKE2s()).toBeDefined();
        });

        test('should throw an error if the given digest length format is invalid', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(33, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

            expect(() => new BLAKE2s(33, keyBuffer)).toThrowError('bad digestLength');
        });
    });

    describe('key or config property', () => {
        test('should create new BLAKE2s instance using array as public key', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(32, ' ');
            const keyBuffer = [...publicKey].map(textToDec);
            const blake2s = new BLAKE2s(publicKey.length, keyBuffer);

            expect(blake2s).toBeDefined();
        });

        test('should create new BLAKE2s instance using uint8array as public key', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(32, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
            const blake2s = new BLAKE2s(publicKey.length, keyBuffer);

            expect(blake2s).toBeDefined();
        });

        test('should create new BLAKE2s instance using config object as public key', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(32, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
            const blake2s = new BLAKE2s(publicKey.length, {
                key: keyBuffer,
                salt: new Uint8Array(8),
                personalization: new Uint8Array(8)
            });

            expect(blake2s).toBeDefined();
        });

        test('should create new BLAKE2s instance using config object as public key (zero length key)', () => {
            const blake2s = new BLAKE2s(32, {
                key: new Uint8Array(0),
                salt: new Uint8Array(8),
                personalization: new Uint8Array(8)
            });

            expect(blake2s).toBeDefined();
        });

        test('should throw an error if the given key or config object is invalid', () => {
            expect(() => new BLAKE2s(32, 'test')).toThrowError('unexpected key or config type');
        });

        test('should throw an error if the given key on config object is invalid', () => {
            expect(
                () =>
                    new BLAKE2s(32, {
                        key: 'test',
                        salt: new Uint8Array(8),
                        personalization: new Uint8Array(8)
                    })
            ).toThrowError('key must be a Uint8Array or an Array of bytes');
        });

        test('should throw an error if the given config object option is invalid', () => {
            expect(() => new BLAKE2s(32, { test: 'test' })).toThrowError('unexpected key in config: test');
        });

        test('should throw an error if the given key has invalid length', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(33, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

            expect(() => new BLAKE2s(publicKey.length - 1, keyBuffer)).toThrowError('key is too long');
        });

        test('should throw an error if the given salt has invalid length', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(32, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

            expect(
                () =>
                    new BLAKE2s(publicKey.length, {
                        key: keyBuffer,
                        salt: new Uint8Array(9)
                    })
            ).toThrowError(`salt must be ${BLAKE2s.saltLength} bytes`);
        });

        test('should throw an error if the given personalization has invalid length', () => {
            let publicKey = 'publicKey';
            publicKey = publicKey.padEnd(32, ' ');
            const keyBuffer = new Uint8Array([...publicKey].map(textToDec));

            expect(
                () =>
                    new BLAKE2s(publicKey.length, {
                        key: keyBuffer,
                        salt: new Uint8Array(8),
                        personalization: new Uint8Array(9)
                    })
            ).toThrowError(`personalization must be ${BLAKE2s.personalizationLength} bytes`);
        });
    });
});

describe('update method', () => {
    test('should process the given data', () => {
        const fileBuffer = Buffer.from('testtesttesttesttesttesttesttest');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);

        expect(() => blake2s.update(fileBuffer)).not.toThrowError();
    });

    test('should process the given data even if the length is zero', () => {
        const fileBuffer = Buffer.from('test');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const blake2s = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer, 0, 0);

        expect(blake2s).toBeDefined();
    });

    test('should throw an error if the given data is invalid', () => {
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);

        expect(() => blake2s.update('test')).toThrowError('update() accepts Uint8Array or an Array of bytes');
    });

    test('should throw an error if the given data already has been hashed', () => {
        const fileBuffer = Buffer.from('test');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const blake2s = new BLAKE2s(publicKey.length, keyBuffer);
        blake2s.isFinished = true;

        expect(() => blake2s.update(fileBuffer)).toThrowError('update() after calling digest()');
    });
});

describe('digest method', () => {
    test('should return the hash of the given data in Uint8Array format', () => {
        const fileBuffer = Buffer.from('testtesttesttesttesttesttesttest');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const byteHash = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).digest();

        expect(byteHash).toEqual(new Uint8Array([206, 91, 251, 9, 151, 31, 78, 228, 157, 14, 161, 194, 15, 33, 79, 5, 55, 187, 59, 123, 218, 174, 32, 164, 92, 80, 85, 156, 230, 26, 140, 139]));
    });

    test('should return the hash of the given data in Uint8Array format (length > 64)', () => {
        const fileBuffer = Buffer.from('testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const byteHash = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).digest();

        expect(byteHash).toEqual(
            new Uint8Array([155, 191, 114, 111, 161, 74, 252, 219, 162, 213, 147, 169, 246, 98, 23, 131, 134, 137, 177, 233, 239, 141, 92, 23, 141, 180, 211, 221, 4, 173, 125, 62])
        );
    });

    test('should return the hash of the given data in Uint8Array format (already finished)', () => {
        const fileBuffer = Buffer.from('test');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const blake2s = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer);
        blake2s.isFinished = true;

        expect(blake2s.digest()).toBeUndefined();
    });
});

describe('hex digest method', () => {
    test('should return the hash of the given data in hex format', () => {
        const fileBuffer = Buffer.from('testtesttesttesttesttesttesttest');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const hexhHash = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();

        expect(hexhHash).toBe('ce5bfb09971f4ee49d0ea1c20f214f0537bb3b7bdaae20a45c50559ce61a8c8b');
    });

    test('should return the hash of the given data in hex format (length < 64)', () => {
        const fileBuffer = Buffer.from('testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest');
        let publicKey = 'publicKey';
        publicKey = publicKey.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const hexhHash = new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();

        expect(hexhHash).toBe('9bbf726fa14afcdba2d593a9f66217838689b1e9ef8d5c178db4d3dd04ad7d3e');
    });
});
