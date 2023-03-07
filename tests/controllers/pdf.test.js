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
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('with user', async () => {
        jest.spyOn(UploadedPDF, 'findByUploaderId').mockResolvedValue([
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

        const req = mockRequest({
            user: {
                id: 1,
                username: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();

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
        jest.spyOn(PDF.prototype, 'sign').mockImplementation(() => Promise.resolve());
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('pdf signed', async () => {
        jest.spyOn(User, 'generatePrivateKey').mockResolvedValue('test');
        jest.spyOn(User, 'findByUsername').mockResolvedValue({
            id: 1,
            username: 'test',
            password: 'test'
        });

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
        jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
        jest.spyOn(User, 'generatePrivateKey').mockResolvedValue('test');
        jest.spyOn(User, 'findByUsername').mockResolvedValue({
            id: 1,
            username: 'test',
            password: 'test'
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('same pdf', async () => {
        jest.spyOn(PDF.prototype, 'decrypt').mockResolvedValue('signature');
        jest.spyOn(PDF.prototype, 'hash').mockReturnValue('signature');

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

        await compareHashPDF(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'test.pdf and test.pdf are the same file');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('different pdf', async () => {
        jest.spyOn(PDF.prototype, 'decrypt').mockResolvedValue('decryptsignature');
        jest.spyOn(PDF.prototype, 'hash').mockReturnValue('hashsignature');

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
    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('pdfs uploaded', async () => {
        jest.spyOn(path, 'join').mockReturnValue('test.pdf');
        jest.spyOn(UploadedPDF, 'create').mockResolvedValue({});

        const req = mockRequest({
            user: { id: 1 },
            files: [{ originalname: 'test.pdf' }, { originalname: 'test2.pdf' }]
        });
        const res = mockResponse();

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
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});
    jest.spyOn(UploadedPDF, 'deleteByPDFName').mockResolvedValue({});

    const req = mockRequest({
        user: { id: 1 },
        body: { deleted_pdf: 'test.pdf' }
    });
    const res = mockResponse();

    await deletePDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted test.pdf');
    expect(res.redirect).toHaveBeenCalledWith('/');

    jest.restoreAllMocks();
});

test('deleteAllPDF Controller', async () => {
    jest.spyOn(UploadedPDF, 'findByUploaderId').mockResolvedValue([{ name: 'test.pdf' }, { name: 'test2.pdf' }]);
    jest.spyOn(fs, 'readdirSync').mockReturnValue(['test.pdf', 'test2.pdf', '.gitkeep']);
    jest.spyOn(UploadedPDF, 'deleteByUploaderId').mockResolvedValue(1);
    jest.spyOn(fs, 'unlinkSync').mockImplementation(() => {});

    const req = mockRequest({ user: { id: 1 } });
    const res = mockResponse();

    await deleteAllPDF(req, res);

    expect(req.flash).toHaveBeenCalledWith('type', 'success');
    expect(req.flash).toHaveBeenCalledWith('message', 'Successfully deleted 2 file(s)');
    expect(res.redirect).toHaveBeenCalledWith('/');

    jest.restoreAllMocks();
});
