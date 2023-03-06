const fs = require('fs');
const path = require('path');
const PDF = require('../../utils/PDF');
const { compareHashPDF, deleteAllPDF, deletePDF, getRoot, signPDF, uploadPDF } = require('../../controllers/pdf');
const { UploadedPDF, User } = require('../../database/models');

const mockRequest = ({ user, file, files, body } = {}) => ({
    flash: jest.fn(),
    user,
    file,
    files,
    body
});
const mockResponse = () => {
    const res = {};
    res.render = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

describe('getRoot Controller', () => {
    test('with user', async () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();

        UploadedPDF.findByUploaderId = jest.fn().mockReturnValue([
            {
                name: 'test.pdf',
                url: `uploads${path.sep}test.pdf`,
                isHashed: true,
                checksum: 'test',
                publicKey: 'test'
            },
            {
                name: 'test2.pdf',
                url: `uploads${path.sep}test2.pdf`,
                isHashed: false,
                checksum: null,
                publicKey: null
            }
        ]);

        await getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            title: 'PDF Digital Signature',
            activeNav: 'home',
            loggedInUser: req.user || null,
            pdfs: [
                {
                    name: 'test.pdf',
                    url: `uploads${path.sep}test.pdf`,
                    isHashed: true,
                    checksum: 'test',
                    publicKey: 'test'
                },
                {
                    name: 'test2.pdf',
                    url: `uploads${path.sep}test2.pdf`,
                    isHashed: false,
                    checksum: null,
                    publicKey: null
                }
            ],
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });

    test('no user', () => {
        const req = mockRequest({ user: null });
        const res = mockResponse();

        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            title: 'PDF Digital Signature',
            activeNav: 'home',
            loggedInUser: req.user || null,
            pdfs: [],
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });
});

describe('signPDF Controller', () => {
    beforeAll(() => {
        PDF.prototype.sign = jest.fn();
    });

    test('pdf signed', async () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: {
                public_key: 'test',
                signed_pdf: 'test.pdf'
            }
        });
        const res = mockResponse();

        User.generatePrivateKey = jest.fn().mockReturnValue('test');
        User.findByUsername = jest.fn().mockReturnValue({
            id: 1,
            username: 'test',
            password: 'test'
        });

        await signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'File test.pdf has been signed');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no public key', () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: { signed_pdf: 'test.pdf' }
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
                public_key: 'testtesttesttesttesttesttesttesttest',
                signed_pdf: 'test.pdf'
            }
        });
        const res = mockResponse();

        signPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Public Key must be 1-32 characters long');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('compareHashPDF Controller', () => {
    beforeAll(() => {
        fs.unlinkSync = jest.fn();
        User.generatePrivateKey = jest.fn().mockReturnValue('test');
        User.findByUsername = jest.fn().mockReturnValue({
            id: 1,
            username: 'test',
            password: 'test'
        });
    });

    test('same pdf', async () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: {
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            }
        });
        const res = mockResponse();

        PDF.prototype.decrypt = jest.fn().mockReturnValue('signature');
        PDF.prototype.hash = jest.fn().mockReturnValue('signature');

        await compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'test.pdf and test.pdf are the same file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('different pdf', async () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: {
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            }
        });
        const res = mockResponse();

        PDF.prototype.decrypt = jest.fn().mockReturnValue('decryptsignature');
        PDF.prototype.hash = jest.fn().mockReturnValue('hashsignature');

        await compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'test.pdf and test.pdf are not the same file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no hashed pdf', () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: { public_key: 'test' },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            }
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please select a hashed PDF file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no normal pdf', () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            body: {
                public_key: 'test',
                hashed_pdf: 'test.pdf'
            }
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please upload a normal PDF file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no public key', () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            },
            body: {
                hashed_pdf: 'test.pdf'
            }
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please enter a public key');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('public key too short or too long', () => {
        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            },
            file: {
                filename: 'test.pdf',
                path: 'test.pdf'
            },
            body: {
                public_key: 'testtesttesttesttesttesttesttesttest',
                hashed_pdf: 'test.pdf'
            }
        });
        const res = mockResponse();

        compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Public Key must be 1-32 characters long');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('uploadPDF Controller', () => {
    test('pdfs uploaded', async () => {
        const req = mockRequest({
            user: { id: 1 },
            files: [{ originalname: 'test.pdf' }, { originalname: 'test2.pdf' }]
        });
        const res = mockResponse();

        path.join = jest.fn().mockReturnValue('test.pdf');
        UploadedPDF.create = jest.fn();

        await uploadPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'Successfully uploaded 2 file(s)');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('no pdfs uploaded', () => {
        const req = mockRequest({ files: [] });
        const res = mockResponse();

        uploadPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Please select one or more files to upload');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

test('deletePDF Controller', async () => {
    const req = mockRequest({
        user: { id: 1 },
        body: { deleted_pdf: 'test.pdf' }
    });
    const res = mockResponse();

    fs.unlinkSync = jest.fn();
    UploadedPDF.deleteByPDFName = jest.fn();

    await deletePDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted test.pdf');
    expect(res.redirect).toHaveBeenCalledWith('/');
});

test('deleteAllPDF Controller', async () => {
    const req = mockRequest({ user: { id: 1 } });
    const res = mockResponse();

    UploadedPDF.findByUploaderId = jest.fn().mockReturnValue([{ name: 'test.pdf' }, { name: 'test2.pdf' }]);
    fs.readdirSync = jest.fn().mockReturnValue(['test.pdf', 'test2.pdf', '.gitkeep']);
    UploadedPDF.deleteByUploaderId = jest.fn();
    fs.unlinkSync = jest.fn();

    await deleteAllPDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted 2 file(s)');
    expect(res.redirect).toHaveBeenCalledWith('/');
});
