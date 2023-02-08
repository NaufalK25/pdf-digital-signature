const { destination, filename } = require('../../middlewares/uploadPDFMiddleware');

describe('destination', () => {
    test('success', () => {
        const req = {};
        const file = {
            mimetype: 'application/pdf'
        };
        const cb = jest.fn();
        destination(req, file, cb);
        expect(cb).toHaveBeenCalledWith(null, 'uploads');
    });

    test('error', () => {
        const req = {};
        const file = {
            mimetype: 'image/png'
        };
        const cb = jest.fn();
        destination(req, file, cb);
        expect(cb).toHaveBeenCalledWith(new Error('Only PDF files are allowed!'));
    });
});

test('filename', () => {
    Date.now = jest.fn(() => 123456789);

    const req = {};
    const file = {
        originalname: 'test.pdf'
    };
    const cb = jest.fn();
    filename(req, file, cb);
    expect(cb).toHaveBeenCalledWith(null, `${Date.now()}-test.pdf`);
});
