const converter = require('../../utils/converter');

test('converter', () => {
    expect(converter.converter('fa', 'hex', 'bin')).toBe('11111010');
    expect(converter.converter('fa', 'hex', 'dec')).toBe(250);
    expect(converter.converter('fa', 'hex', 'text')).toBe('ú');

    expect(converter.converter('11111010', 'bin', 'hex')).toBe('fa');

    expect(converter.converter(250, 'dec', 'hex')).toBe('fa');
    expect(converter.converter(250, 'dec', 'bin')).toBe('11111010');
    expect(converter.converter(250, 'dec', 'text')).toBe('ú');

    expect(converter.converter('ú', 'text', 'dec')).toBe(250);
});

describe('to binary', () => {
    test('decimal to binary', () => {
        expect(converter.decToBin(250)).toBe('11111010');
    });
    test('hexadecimal to binary', () => {
        expect(converter.hexToBin('fa')).toBe('11111010');
    });
});

describe('to decimal', () => {
    test('hexadecimal to decimal', () => {
        expect(converter.hexToDec('fa')).toBe(250);
    });

    test('text to decimal', () => {
        expect(converter.textToDec('ú')).toBe(250);
    });
});

describe('to hexadecimal', () => {
    test('binary to hexadecimal', () => {
        expect(converter.binToHex('11111010')).toBe('fa');
    });

    test('decimal to hexadecimal', () => {
        expect(converter.decToHex(250)).toBe('fa');
    });
});

describe('to text', () => {
    test('decimal to text', () => {
        expect(converter.decToText(250)).toBe('ú');
    });

    test('hexadecimal to text', () => {
        expect(converter.hexToText('fa')).toBe('ú');
    });
});
