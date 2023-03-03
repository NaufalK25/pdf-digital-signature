const path = require('path');
const PDF = require('../../utils/PDF');
const { rootDir } = require('../../config/constant');

const testPDF = path.join(rootDir, 'tests', 'test.pdf');

test('success', () => {
    expect(1).toBe(1);
});

// test('constructor', () => {
//     const pdf = new PDF('test.pdf');
//     expect(pdf.filePath).toBe('test.pdf');
// });

// test('hash', () => {
//     const hash = new PDF(testPDF).hash('test');

//     expect(hash).toBe('d9b4a76e957a753ef37644e5ca98b910c59b9ad981d6db0cbe2b1db9c4285de4');
// });

// test('decrypt', () => {
//     const decryptedHash = new PDF(testPDF).decrypt('test                            ', {
//         jsonPath: path.join(rootDir, 'tests', 'data.json')
//     });

//     expect(decryptedHash).toBe('d9b4a76e957a753ef37644e5ca98b910c59b9ad981d6db0cbe2b1db9c4285de4');
// });

// test('sign', () => {
//     new PDF(path.join(rootDir, 'tests', 'test2.pdf')).sign('test                            ', 'test', {
//         jsonPath: path.join(rootDir, 'tests', 'data.json')
//     });

//     expect(getData('test2.pdf', path.join(rootDir, 'tests', 'data.json')).checksum).toBe("¶øÙIè\u001bR¡P,\u0001'ò\u0018\u001cªju[ë«\u001b\\\u0004yýà\u0001\u0010\u00073Ç@\u001d@ uäcé$y¡ÓÞxªh²Ø\u0014G");

//     removeData('test2.pdf', path.join(rootDir, 'tests', 'data.json'));
// });
