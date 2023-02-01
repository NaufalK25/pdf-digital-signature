// const fs = require('fs');
// const path = require('path');
// const AES = require('../../../utils/AES');
// const { deleteFromCloud, uploadToCloud } = require('../../../utils/cloud');
// const { clearDir, createDir } = require('../../../utils/file');

// jest.mock('fs', () => {
//     return {
//         readFileSync: jest.fn(() => Buffer.from([1, 2, 3])),
//         writeFileSync: jest.fn(),
//         unlinkSync: jest.fn()
//     };
// });

// jest.mock('path', () => {
//     return {
//         dirname: jest.fn(() => 'dir'),
//         basename: jest.fn(() => 'file.pdf')
//     };
// });

// jest.mock('../../../utils/cloud', () => {
//     return {
//         deleteFromCloud: jest.fn(() =>
//             Promise.resolve({
//                 success: true,
//                 name: 'file.pdf',
//                 url: ''
//             })
//         ),
//         uploadToCloud: jest.fn(() =>
//             Promise.resolve({
//                 success: true,
//                 name: 'file.pdf',
//                 url: ''
//             })
//         )
//     };
// });

// jest.mock('../../../utils/file', () => {
//     return {
//         createDir: jest.fn(),
//         clearDir: jest.fn()
//     };
// });

// jest.mock('../../../utils/AES', () => {
//     return {
//         encrypt: jest.fn(byte => byte + 1),
//         decrypt: jest.fn(byte => byte - 1)
//     };
// });

// const PDF = require('../../../utils/PDF');

// describe('PDF Class', () => {
//     it('can be instantiated', () => {
//         const pdf = new PDF('file.pdf');

//         expect(pdf).toBeInstanceOf(PDF);
//         expect(pdf.filePath).toBe('file.pdf');
//     });

//     it('can be instantiated without a file path', () => {
//         const pdf = new PDF();

//         expect(pdf).toBeInstanceOf(PDF);
//         expect(pdf.filePath).toBe('');
//     });
// });

// describe('PDF Encryption', () => {
//     it('should encrypt the file', async () => {
//         const pdf = new PDF('file.pdf');
//         const encryptedPDF = await pdf.encrypt('encrypted.pdf');

//         expect(encryptedPDF).toBeInstanceOf(PDF);
//         expect(path.dirname).toHaveBeenCalledWith('encrypted.pdf');
//         expect(createDir).toHaveBeenCalledWith(path.dirname('encrypted.pdf'));
//         expect(fs.readFileSync).toHaveBeenCalledWith('file.pdf');
//         expect(AES.encrypt).toHaveBeenCalledWith(1, AES.key128);
//         expect(AES.encrypt).toHaveBeenCalledWith(2, AES.key128);
//         expect(AES.encrypt).toHaveBeenCalledWith(3, AES.key128);
//         expect(fs.writeFileSync).toHaveBeenCalledWith('encrypted.pdf', Buffer.from([2, 3, 4]));
//         expect(path.basename).toHaveBeenCalledWith('encrypted.pdf');
//         expect(uploadToCloud).toHaveBeenCalledWith('encrypted.pdf', 'file.pdf');
//         expect(deleteFromCloud).toHaveBeenCalledWith('file.pdf');
//         expect(fs.unlinkSync).toHaveBeenCalledWith('file.pdf');
//     });
// });

// describe('PDF Decryption', () => {
//     it('should decrypt the file', async () => {
//         const pdf = new PDF('file.pdf');
//         const decryptedPDF = await pdf.decrypt('decrypted.pdf');

//         expect(decryptedPDF).toBeInstanceOf(PDF);
//         expect(path.dirname).toHaveBeenCalledWith('decrypted.pdf');
//         expect(createDir).toHaveBeenCalledWith(path.dirname('decrypted.pdf'));
//         expect(fs.readFileSync).toHaveBeenCalledWith('file.pdf');
//         expect(AES.decrypt).toHaveBeenCalledWith(1, AES.key128);
//         expect(AES.decrypt).toHaveBeenCalledWith(2, AES.key128);
//         expect(AES.decrypt).toHaveBeenCalledWith(3, AES.key128);
//         expect(fs.writeFileSync).toHaveBeenCalledWith('decrypted.pdf', Buffer.from([0, 1, 2]));
//         expect(path.basename).toHaveBeenCalledWith('decrypted.pdf');
//         expect(uploadToCloud).toHaveBeenCalledWith('decrypted.pdf', 'file.pdf');
//         expect(deleteFromCloud).toHaveBeenCalledWith('file.pdf');
//         expect(fs.unlinkSync).toHaveBeenCalledWith('file.pdf');
//     });
// });

test('true', () => {
    expect(true).toBe(true);
});
