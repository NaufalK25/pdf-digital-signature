const { asciiToBytes, asciiToHex, bytesToAscii, bytesToHex, hexToAscii, hexToBytes } = require('../../utils/stringConverter');

const str = 'test';
const bytes = [116, 101, 115, 116];
const hex = '74657374';

describe('ascii converter', () => {
    it('should convert to bytes as expected', () => {
        expect(asciiToBytes(str)).toEqual(bytes);
        expect(asciiToBytes('')).toEqual([]);
        expect(asciiToBytes()).toEqual([]);
    });

    it('should convert to hex as expected', () => {
        expect(asciiToHex(str)).toEqual(hex);
        expect(asciiToHex('')).toEqual('');
        expect(asciiToHex()).toEqual('');
    });
});

describe('bytes converter', () => {
    it('should convert to ascii as expected', () => {
        expect(bytesToAscii(bytes)).toEqual(str);
        expect(bytesToAscii([])).toEqual('');
        expect(bytesToAscii()).toEqual('');
    });

    it('should convert to hex as expected', () => {
        expect(bytesToHex(bytes)).toEqual(hex);
        expect(bytesToHex([])).toEqual('');
        expect(bytesToHex()).toEqual('');
    });
});

describe('hex converter', () => {
    it('should convert to ascii as expected', () => {
        expect(hexToAscii(hex)).toEqual(str);
        expect(hexToAscii('')).toEqual('');
        expect(hexToAscii()).toEqual('');
    });

    it('should convert to bytes as expected', () => {
        expect(hexToBytes(hex)).toEqual(bytes);
        expect(hexToBytes('')).toEqual([]);
        expect(hexToBytes()).toEqual([]);
    });
});
