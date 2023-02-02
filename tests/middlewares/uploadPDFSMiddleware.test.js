const { destination, filename } = require('../../middlewares/uploadPDFSMiddleware');

describe('destination function', () => {
    it('should be working as expected', () => {
        const req = {};
        const file = { mimetype: 'application/pdf' };
        const cb = jest.fn();

        destination(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, 'uploads');
    });

    it('should return an error if the file is not a PDF', () => {
        const req = {};
        const file = { mimetype: 'text/plain' };
        const cb = jest.fn();

        destination(req, file, cb);

        expect(cb).toHaveBeenCalledWith(new Error('Only PDF files are allowed!'));
    });
});

describe('filename function', () => {
    it('should be working as expected', () => {
        Date.now = jest.fn(() => 123456789);

        const req = {};
        const file = { originalname: 'test.pdf' };
        const cb = jest.fn();

        filename(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, `${Date.now()}-${file.originalname}`);
    });
});
