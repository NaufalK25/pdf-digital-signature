const path = require('path');
const AES = require('../../utils/AES');
const PDF = require('../../utils/PDF');
const { rootDir } = require('../../config/constant');
const { UploadedPDF } = require('../../database/models');

const pdfName = 'test.pdf';
const testPDF = path.join(rootDir, 'tests', pdfName);
const publicKey = 'test';
const privateKey = 'test                            ';
const expectedHash = 'd9b4a76e957a753ef37644e5ca98b910c59b9ad981d6db0cbe2b1db9c4285de4';

const mockRequest = ({ user } = {}) => ({ user });

afterAll(() => {
    jest.restoreAllMocks();
});

test('constructor method should create new PDF instance', () => {
    const pdf = new PDF(pdfName);
    expect(pdf.filePath).toBe(pdfName);
});

test('hash method should hash the given pdf', () => {
    const hash = new PDF(testPDF).hash(publicKey);

    expect(hash).toBe(expectedHash);
});

test('decrypt method should decrypt the given pdf hash', async () => {
    jest.spyOn(UploadedPDF, 'getChecksumByPDFName').mockResolvedValue(expectedHash);
    jest.spyOn(AES.prototype, 'decrypt').mockReturnValue(expectedHash);

    const req = mockRequest({ user: { id: 1 } });
    const decryptedHash = await new PDF(testPDF).decrypt(req, privateKey);

    expect(decryptedHash).toBe(expectedHash);
});

test('sign method should sign the given pdf', async () => {
    jest.spyOn(UploadedPDF, 'updateByPDFName').mockResolvedValue([1]);

    const req = mockRequest({ user: { id: 1 } });
    new PDF(path.join(rootDir, 'tests', 'test2.pdf')).sign(req, privateKey, publicKey);

    expect(UploadedPDF.updateByPDFName).toBeCalledWith(1, 'test2.pdf', {
        isHashed: true,
        checksum: "¶øÙIè\u001bR¡P,\u0001'ò\u0018\u001cªju[ë«\u001b\\\u0004yýà\u0001\u0010\u00073Ç@\u001d@ uäcé$y¡ÓÞxªh²Ø\u0014G",
        publicKey: privateKey
    });
});
