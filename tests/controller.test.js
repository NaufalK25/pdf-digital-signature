const fs = require('fs');
const path = require('path');
const PDF = require('../PDF');

jest.mock('../utils/constant', () => {
    return {
        ...jest.requireActual('../utils/constant'),
        uploadsDir: `${__dirname}/../tests/resources`
    };
});

const { uploadsDir } = require('../utils/constant');
const { decryptPDF, deleteAllPDF, deletePDF, encryptPDF, getRoot, uploadPDF } = require('../controller');

const mockRequest = ({ body } = {}) => ({ body });
const mockResponse = () => {
    const res = {};
    res.render = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

let req = mockRequest();
let res = mockResponse();

beforeAll(() => {
    fs.readdirSync = jest.fn().mockReturnValue(['test.pdf', 'test2.pdf']);
    path.parse = jest.fn().mockReturnValue({ ext: '.pdf' });
    fs.unlinkSync = jest.fn();
});

afterAll(() => {
    if (!fs.existsSync(path.join(uploadsDir, '..', 'uploads', '.gitkeep'))) {
        fs.writeFileSync(path.join(uploadsDir, '..', 'uploads', '.gitkeep'), '');
    }
});

describe('GET /', () => {
    it('should render index page', () => {
        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            pdfs: [
                { name: 'test2.pdf', isEncrypted: false },
                { name: 'test.pdf', isEncrypted: false }
            ]
        });
    });

    it('should sort pdfs by name in descending order', () => {
        fs.readdirSync = jest.fn().mockReturnValue(['test2.pdf', 'test.pdf']);
        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            pdfs: [
                { name: 'test2.pdf', isEncrypted: false },
                { name: 'test.pdf', isEncrypted: false }
            ]
        });
    });

    it('should work when there are more than 1 pdf but with the same name and extension', () => {
        fs.readdirSync = jest.fn().mockReturnValue(['test.pdf', 'test.pdf']);
        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            pdfs: [
                { name: 'test.pdf', isEncrypted: false },
                { name: 'test.pdf', isEncrypted: false }
            ]
        });
    });

    it('should work when there are 1 pdf', () => {
        fs.readdirSync = jest.fn().mockReturnValue(['test.pdf']);
        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', {
            pdfs: [{ name: 'test.pdf', isEncrypted: false }]
        });
    });

    it('should work when there are 0 pdf', () => {
        fs.readdirSync = jest.fn().mockReturnValue([]);
        getRoot(req, res);

        expect(res.render).toHaveBeenCalledWith('index', { pdfs: [] });
    });
});

describe('POST /encrypt', () => {
    it('should redirect to /', () => {
        PDF.prototype.encrypt = jest.fn();

        req = mockRequest({
            body: {
                encrypted_file: 'decrypted-test.pdf'
            }
        });

        encryptPDF(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('POST /decrypt', () => {
    it('should redirect to /', () => {
        PDF.prototype.decrypt = jest.fn();

        const req = mockRequest({
            body: {
                decrypted_file: 'encrypted-test.pdf'
            }
        });
        const res = mockResponse();

        decryptPDF(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('POST /uploads', () => {
    it('should redirect to /', () => {
        uploadPDF(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('POST /delete', () => {
    it('should redirect to /', () => {
        req = mockRequest({
            body: {
                deleted_file: 'test.pdf'
            }
        });

        deletePDF(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('POST /delete-all', () => {
    it('should redirect to /', () => {
        deleteAllPDF(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});
