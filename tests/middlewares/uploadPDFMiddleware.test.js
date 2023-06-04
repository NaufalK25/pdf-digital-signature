const { destination, filename } = require('../../middlewares/uploadPDFMiddleware');

let req, cb;

beforeAll(() => {
    req = {};
    cb = jest.fn();
});

describe('destination function', () => {
    test('should upload the file to uploads folder', () => {
        const file = { mimetype: 'application/pdf' };

        destination(req, file, cb);

        expect(cb).toHaveBeenCalledWith(null, 'uploads');
    });

    test('should throw an error if the file is not a PDF', () => {
        const file = { mimetype: 'image/png' };

        destination(req, file, cb);

        expect(cb).toHaveBeenCalledWith(new Error('Hanya file PDF yang diperbolehkan'));
    });
});

test('filename function should return the filename with the given format (timestamp-originalname)', () => {
    jest.spyOn(Date, 'now').mockReturnValue(123456789);

    const file = { originalname: 'test.pdf' };

    filename(req, file, cb);

    expect(cb).toHaveBeenCalledWith(null, `${Date.now()}-test.pdf`);

    jest.restoreAllMocks();
});
