const PDF = require('../../utils/PDF');
let file;

const filename = 'test.pdf';
const filePath = '/path/to';

describe('PDF Class', () => {
    it('can be instantiated', () => {
        const pdf = new PDF('/path/to/test.pdf');
        expect(pdf).toBeInstanceOf(PDF);
        expect(pdf.filePath).toEqual('/path/to/test.pdf');
    });

    it('can be instantiated without filePath', () => {
        const pdf = new PDF();
        expect(pdf).toBeInstanceOf(PDF);
        expect(pdf.filePath).toEqual('');
    });
});

// describe('PDF Encryption', () => {
//     beforeEach(() => {
//         jest.resetModules();

//         jest.mock('path', () => {
//             return {
//                 ...jest.requireActual('path'),
//                 dirname: jest.fn().mockReturnValue('/path/to'),
//                 basename: jest.fn().mockReturnValue('test.pdf')
//             };
//         });

//         jest.mock('dropbox', () => {
//             return {
//                 Dropbox: jest.fn().mockImplementation(() => {
//                     return {
//                         filesUpload: jest.fn().mockResolvedValue({
//                             result: {
//                                 name: 'test.pdf',
//                                 path_lower: '/test.pdf'
//                             }
//                         }),
//                         filesDeleteV2: jest.fn().mockResolvedValue({
//                             result: {
//                                 name: 'test.pdf',
//                                 path_lower: '/test.pdf'
//                             }
//                         }),
//                         sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
//                             result: {
//                                 url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                             }
//                         })
//                     };
//                 })
//             };
//         });

//         jest.mock('../../utils/cloud', () => {
//             return {
//                 uploadToCloud: jest.fn().mockResolvedValue({
//                     success: true,
//                     name: 'test.pdf',
//                     url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                 }),
//                 deleteFromCloud: jest.fn().mockResolvedValue({
//                     success: true,
//                     name: 'test.pdf',
//                     url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                 })
//             };
//         });

//         jest.mock('../../utils/crypto/oldAES', () => {
//             return {
//                 encrypt: jest.fn().mockReturnValue(1),
//                 decrypt: jest.fn().mockReturnValue(1),
//                 key128: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
//             };
//         });

//         jest.mock('../../utils/file', () => {
//             return {
//                 createDir: jest.fn(),
//                 clearDir: jest.fn()
//             };
//         });

//         file = require('../../utils/file');
//     });

//     describe('success scenario', () => {
//         beforeEach(() => {
//             jest.mock('fs', () => {
//                 return {
//                     ...jest.requireActual('fs'),
//                     existsSync: jest.fn().mockReturnValue(true),
//                     mkdirSync: jest.fn(),
//                     readFileSync: jest.fn().mockReturnValue(Buffer.from('test')),
//                     writeFileSync: jest.fn(),
//                     unlinkSync: jest.fn(),
//                     readdirSync: jest.fn().mockReturnValue(['test.pdf'])
//                 };
//             });
//         });

//         it('should encrypt pdf', async () => {
//             const pdf = new PDF(`${filePath}/${filename}`);
//             const encryptedPDF = await pdf.encrypt(`${filePath}/encrypted.pdf`);

//             expect(encryptedPDF).toBeInstanceOf(PDF);
//             expect(encryptedPDF.filePath).toEqual(`${filePath}/${filename}`);
//         });
//     });

//     describe('error scenario', () => {
//         beforeEach(() => {
//             jest.mock('fs', () => {
//                 return {
//                     ...jest.requireActual('fs'),
//                     existsSync: jest.fn().mockReturnValue(true),
//                     mkdirSync: jest.fn(),
//                     readFileSync: jest.fn().mockImplementation(() => {
//                         throw new Error('Error Occured');
//                     }),
//                     writeFileSync: jest.fn(),
//                     unlinkSync: jest.fn(),
//                     readdirSync: jest.fn().mockReturnValue(['test.pdf'])
//                 };
//             });
//         });

//         it('should clear dest dir if error occurs', async () => {
//             const pdf = new PDF(`${filePath}/${filename}`);
//             try {
//                 await pdf.encrypt(`${filePath}/encrypted.pdf`);
//             } catch (err) {
//                 expect(file.clearDir).toHaveBeenCalled();
//             }
//         });
//     });
// });

// describe('PDF Decryption', () => {
//     beforeEach(() => {
//         jest.resetModules();

//         jest.mock('path', () => {
//             return {
//                 ...jest.requireActual('path'),
//                 dirname: jest.fn().mockReturnValue('/path/to'),
//                 basename: jest.fn().mockReturnValue('test.pdf')
//             };
//         });

//         jest.mock('dropbox', () => {
//             return {
//                 Dropbox: jest.fn().mockImplementation(() => {
//                     return {
//                         filesUpload: jest.fn().mockResolvedValue({
//                             result: {
//                                 name: 'test.pdf',
//                                 path_lower: '/test.pdf'
//                             }
//                         }),
//                         filesDeleteV2: jest.fn().mockResolvedValue({
//                             result: {
//                                 name: 'test.pdf',
//                                 path_lower: '/test.pdf'
//                             }
//                         }),
//                         sharingCreateSharedLinkWithSettings: jest.fn().mockResolvedValue({
//                             result: {
//                                 url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                             }
//                         })
//                     };
//                 })
//             };
//         });

//         jest.mock('../../utils/cloud', () => {
//             return {
//                 uploadToCloud: jest.fn().mockResolvedValue({
//                     success: true,
//                     name: 'test.pdf',
//                     url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                 }),
//                 deleteFromCloud: jest.fn().mockResolvedValue({
//                     success: true,
//                     name: 'test.pdf',
//                     url: 'https://www.dropbox.com/s/test.pdf?dl=0'
//                 })
//             };
//         });

//         jest.mock('../../utils/crypto/oldAES', () => {
//             return {
//                 encrypt: jest.fn().mockReturnValue(1),
//                 decrypt: jest.fn().mockReturnValue(1),
//                 key128: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
//             };
//         });

//         jest.mock('../../utils/file', () => {
//             return {
//                 createDir: jest.fn(),
//                 clearDir: jest.fn()
//             };
//         });

//         file = require('../../utils/file');
//     });

//     describe('success scenario', () => {
//         beforeEach(() => {
//             jest.mock('fs', () => {
//                 return {
//                     ...jest.requireActual('fs'),
//                     existsSync: jest.fn().mockReturnValue(true),
//                     mkdirSync: jest.fn(),
//                     readFileSync: jest.fn().mockReturnValue(Buffer.from('test')),
//                     writeFileSync: jest.fn(),
//                     unlinkSync: jest.fn(),
//                     readdirSync: jest.fn().mockReturnValue(['test.pdf'])
//                 };
//             });
//         });

//         it('should decrypt pdf', async () => {
//             const pdf = new PDF(`${filePath}/${filename}`);
//             const decryptedPDF = await pdf.decrypt(`${filePath}/decrypted.pdf`);

//             expect(decryptedPDF).toBeInstanceOf(PDF);
//             expect(decryptedPDF.filePath).toEqual(`${filePath}/${filename}`);
//         });
//     });

//     describe('error scenario', () => {
//         beforeEach(() => {
//             jest.mock('fs', () => {
//                 return {
//                     ...jest.requireActual('fs'),
//                     existsSync: jest.fn().mockReturnValue(true),
//                     mkdirSync: jest.fn(),
//                     readFileSync: jest.fn().mockImplementation(() => {
//                         throw new Error('Error Occured');
//                     }),
//                     writeFileSync: jest.fn(),
//                     unlinkSync: jest.fn(),
//                     readdirSync: jest.fn().mockReturnValue(['test.pdf'])
//                 };
//             });
//         });

//         it('should clear dest dir if error occurs', async () => {
//             const pdf = new PDF(`${filePath}/${filename}`);
//             try {
//                 await pdf.decrypt(`${filePath}/decrypted.pdf`);
//             } catch (err) {
//                 expect(file.clearDir).toHaveBeenCalled();
//             }
//         });
//     });
// });
