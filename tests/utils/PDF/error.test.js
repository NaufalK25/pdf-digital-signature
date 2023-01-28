const PDF = require('../../../utils/PDF');
const { clearDir } = require('../../../utils/file');

jest.mock('../../../utils/file', () => ({
    clearDir: jest.fn(),
    createDir: jest.fn()
}));

describe('PDF Error', () => {
    it('should clear destination directory if encryption fails', async () => {
        const pdf = new PDF('file.pdf');
        try {
            await pdf.encrypt('encrypted.pdf');
        } catch (err) {
            expect(clearDir).toHaveBeenCalled();
        }
    });

    it('should clear destination directory if decryption fails', async () => {
        const pdf = new PDF('file.pdf');
        try {
            await pdf.decrypt('decrypted.pdf');
        } catch (err) {
            expect(clearDir).toHaveBeenCalled();
        }
    });
});
