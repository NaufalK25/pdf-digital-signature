const fs = require('fs');
const path = require('path');
const PDF = require('../../utils/PDF');
const { compareHashPDF, deleteAllPDF, deletePDF, getRoot, signPDF, uploadPDF } = require('../../controllers/pdf');

jest.mock('../../utils/data', () => {
    return {
        removeData: jest.fn(),
        getData: jest.fn().mockReturnValue({
            checksum: 'test',
            publicKey: 'test'
        }),
        isDataExist: jest.fn().mockReturnValue(true)
    };
});

const mockRequest = ({ file, files, flash, body }) => ({
    file,
    files,
    flash,
    body
});
const mockResponse = () => {
    const res = {};
    res.render = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

test('getRoot Controller', () => {
    fs.readdirSync = jest.fn().mockReturnValue(['.gitkeep', 'test3.pdf', 'test.pdf', 'test2.pdf']);

    const req = mockRequest({
        flash: jest.fn()
    });
    const res = mockResponse();

    getRoot(req, res);

    expect(res.render).toHaveBeenCalledWith('index', {
        pdfs: [
            {
                name: 'test3.pdf',
                url: `uploads${path.sep}test3.pdf`,
                isHashed: true,
                data: {
                    checksum: 'test',
                    publicKey: 'test'
                }
            },
            {
                name: 'test2.pdf',
                url: `uploads${path.sep}test2.pdf`,
                isHashed: true,
                data: {
                    checksum: 'test',
                    publicKey: 'test'
                }
            },
            {
                name: 'test.pdf',
                url: `uploads${path.sep}test.pdf`,
                isHashed: true,
                data: {
                    checksum: 'test',
                    publicKey: 'test'
                }
            }
        ],
        flash: {
            type: '',
            message: ''
        }
    });
});

describe('signPDF Controller', () => {
    beforeAll(() => {
        PDF.prototype.sign = jest.fn();
    });

    afterAll(() => {
        PDF.prototype.sign.mockRestore();
    });

    test('no private key', () => {
        const req = mockRequest({
            body: {
                public_key: 'test',
                signed_pdf: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please enter a private key');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no public key', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                signed_pdf: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please enter a public key');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('public key too short or too long', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'testtesttesttesttesttesttesttesttest',
                signed_pdf: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Public Key must be 1-32 characters long');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('pdf signed', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'test',
                signed_pdf: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'File test.pdf has been signed');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('compareHashPDF Controller', () => {
    beforeAll(() => {
        fs.unlinkSync = jest.fn();
        PDF.prototype.decrypt = jest.fn().mockReturnValue('signature');
        PDF.prototype.hash = jest.fn().mockReturnValue('signature');
    });

    afterAll(() => {
        fs.unlinkSync.mockRestore();
        PDF.prototype.decrypt.mockRestore();
        PDF.prototype.hash.mockRestore();
    });

    test('no hashed pdf', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'test'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please select a hashed PDF file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no normal pdf', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please upload a normal PDF file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('same pdf', () => {
        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'test.pdf and test.pdf are the same file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('different pdf', () => {
        PDF.prototype.decrypt = jest.fn().mockReturnValue('decryptedsignature');
        PDF.prototype.hash = jest.fn().mockReturnValue('hashedsignature');

        const req = mockRequest({
            body: {
                private_key: 'test',
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            },
            flash: jest.fn()
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'test.pdf and test.pdf are not the same file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('uploadPDF Controller', () => {
    test('pdfs uploaded', () => {
        const req = mockRequest({
            files: [{ originalname: 'test.pdf' }, { originalname: 'test2.pdf' }],
            flash: jest.fn()
        });
        const res = mockResponse();

        uploadPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'Successfully uploaded 2 file(s)');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no pdfs uploaded', () => {
        const req = mockRequest({
            files: [],
            flash: jest.fn()
        });
        const res = mockResponse();

        uploadPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please select one or more files to upload');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

test('deletePDF Controller', () => {
    fs.unlinkSync = jest.fn();
    removeData = jest.fn();

    const req = mockRequest({
        body: { deleted_pdf: 'test.pdf' },
        flash: jest.fn()
    });
    const res = mockResponse();

    deletePDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted test.pdf');
    expect(res.redirect).toHaveBeenCalledWith('/');
});

test('deleteAllPDF Controller', () => {
    fs.readdirSync = jest.fn().mockReturnValue(['test.pdf', 'test2.pdf', '.gitkeep']);
    fs.unlinkSync = jest.fn();

    const req = mockRequest({
        flash: jest.fn()
    });
    const res = mockResponse();

    deleteAllPDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted 2 file(s)');
    expect(res.redirect).toHaveBeenCalledWith('/');
});
