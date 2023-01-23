const { asciiToBytes, asciiToHex, bytesToAscii, bytesToHex, hexToAscii, hexToBytes } = require('../../utils/stringConverter');

test('asciiToBytes function should covert ascii to bytes as expected', () => {
    expect(asciiToBytes('test')).toEqual([116, 101, 115, 116]);
    expect(asciiToBytes('')).toEqual([]);
    expect(asciiToBytes()).toEqual([]);
});

test('asciiToHex function should covert ascii to hex as expected', () => {
    expect(asciiToHex('test')).toEqual('74657374');
    expect(asciiToHex('')).toEqual('');
    expect(asciiToHex()).toEqual('');
});

test('bytesToAscii function should covert bytes to ascii as expected', () => {
    expect(bytesToAscii([116, 101, 115, 116])).toEqual('test');
    expect(bytesToAscii([])).toEqual('');
    expect(bytesToAscii()).toEqual('');
});

test('bytesToHex function should covert bytes to hex as expected', () => {
    expect(bytesToHex([116, 101, 115, 116])).toEqual('74657374');
    expect(bytesToHex([])).toEqual('');
    expect(bytesToHex()).toEqual('');
});

test('hexToAscii function should covert hex to ascii as expected', () => {
    expect(hexToAscii('74657374')).toEqual('test');
    expect(hexToAscii('')).toEqual('');
    expect(hexToAscii()).toEqual('');
});

test('hexToBytes function should covert hex to bytes as expected', () => {
    expect(hexToBytes('74657374')).toEqual([116, 101, 115, 116]);
    expect(hexToBytes('')).toEqual([]);
    expect(hexToBytes()).toEqual([]);
});
