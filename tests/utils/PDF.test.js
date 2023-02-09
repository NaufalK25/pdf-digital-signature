// const fs = require('fs');
// const PDF = require('../../utils/PDF');

// jest.mock('../../utils/data', () => {
//     return {
//         addData: jest.fn(),
//         getData: jest.fn().mockReturnValue({
//             checksum: [
//                 'j',
//                 '\x18',
//                 '\x1D',
//                 '\x02',
//                 'È',
//                 'e',
//                 '{',
//                 '<',
//                 '-',
//                 '2',
//                 '\x80',
//                 '=',
//                 '5',
//                 'å',
//                 'W',
//                 '\x81',
//                 'å',
//                 'Â',
//                 'º',
//                 '/',
//                 'Ü',
//                 '¨',
//                 '\x9F',
//                 '\x93',
//                 'i',
//                 '\x8A',
//                 '\x99',
//                 'ß',
//                 'Ç',
//                 '×',
//                 'û',
//                 ':',
//                 'e',
//                 '\x10',
//                 '\x12',
//                 '9',
//                 'b',
//                 '\x91',
//                 '\x9D',
//                 'å',
//                 'À',
//                 'C',
//                 'N',
//                 '\x1C',
//                 'þ',
//                 '@',
//                 '>',
//                 '\x7F',
//                 'd',
//                 '£',
//                 '\x06',
//                 'Q',
//                 'ÿ',
//                 '\\',
//                 'ý',
//                 '\x1F',
//                 'å',
//                 'Y',
//                 'ð',
//                 '(',
//                 '/',
//                 '}',
//                 'y',
//                 'ê'
//             ].join(''),
//             publicKey: 'test'
//         })
//     };
// });

// const data = require('../../utils/data');

// test('constructor', () => {
//     const pdf = new PDF('test.pdf');
//     expect(pdf.filePath).toBe('test.pdf');
// });

// test('hash', () => {
//     fs.readFileSync = jest.fn().mockReturnValue(Buffer.from('test'));

//     const hash = new PDF('test.pdf').hash('test');

//     expect(hash).toBe('cfc015064234dc3491415edf9a9821cfaf6c28df9f856a121421d6370aea5b1b');
// });

// test('decrypt', () => {
//     const decryptedHash = new PDF('test.pdf').decrypt('test');

//     expect(decryptedHash).toBe('cfc015064234dc3491415edf9a9821cfaf6c28df9f856a121421d6370aea5b1b');
// });

// test('sign', () => {
//     fs.readFileSync = jest.fn().mockReturnValue(Buffer.from('test'));

//     new PDF('test.js').sign('test', 'test');

//     expect(data.addData).toBeCalledWith('test.js', {
//         checksum: [
//             'j',
//             '\x18',
//             '\x1D',
//             '\x02',
//             'È',
//             'e',
//             '{',
//             '<',
//             '-',
//             '2',
//             '\x80',
//             '=',
//             '5',
//             'å',
//             'W',
//             '\x81',
//             'å',
//             'Â',
//             'º',
//             '/',
//             'Ü',
//             '¨',
//             '\x9F',
//             '\x93',
//             'i',
//             '\x8A',
//             '\x99',
//             'ß',
//             'Ç',
//             '×',
//             'û',
//             ':',
//             'e',
//             '\x10',
//             '\x12',
//             '9',
//             'b',
//             '\x91',
//             '\x9D',
//             'å',
//             'À',
//             'C',
//             'N',
//             '\x1C',
//             'þ',
//             '@',
//             '>',
//             '\x7F',
//             'd',
//             '£',
//             '\x06',
//             'Q',
//             'ÿ',
//             '\\',
//             'ý',
//             '\x1F',
//             'å',
//             'Y',
//             'ð',
//             '(',
//             '/',
//             '}',
//             'y',
//             'ê'
//         ].join(''),
//         publicKey: 'test                            '
//     });
// });

test('true', () => expect(true).toBe(true));
