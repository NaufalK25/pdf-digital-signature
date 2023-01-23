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

let pdf,
    pdfFile = path.join(uploadsDir, 'pdf-test.pdf'),
    dest = path.join(uploadsDir, '..', 'uploads');

beforeAll(() => {
    fs.copyFileSync(path.join(uploadsDir, 'test.pdf'), pdfFile);
    pdf = new PDF(pdfFile);
});

afterAll(() => {
    if (!fs.existsSync(path.join(dest, '.gitkeep'))) {
        fs.writeFileSync(path.join(dest, '.gitkeep'), '');
    }
});

describe('PDF Class', () => {
    it('should return PDF instance', () => {
        expect(pdf).toBeInstanceOf(PDF);
    });

    it('should have PDF behavior', () => {
        expect(pdf).toHaveProperty('filePath');
        expect(pdf.filePath).toEqual(pdfFile);
        expect(pdf).toHaveProperty('encrypt');
        expect(pdf).toHaveProperty('decrypt');
    });
});

describe('PDF Object', () => {
    it('encrypt method should be working as expected', () => {
        const newDest = path.join(dest, 'encrypted-pdf-test.pdf');
        pdf.encrypt(newDest);

        expect(fs.existsSync(newDest)).toBeTruthy();
    });

    it('decrypt method should be working as expected', () => {
        const newDest = path.join(dest, 'decrypted-pdf-test.pdf');
        pdf = new PDF(path.join(dest, 'encrypted-pdf-test.pdf'));
        pdf.decrypt(newDest);

        expect(fs.existsSync(newDest)).toBeTruthy();
    });
});

describe('PDF Error', () => {
    beforeAll(() => {
        fs.writeFileSync = jest.fn(() => {
            throw new Error('Error');
        });
    });

    it('encrypt method can throw error', () => {
        const newDest = path.join(dest, 'decrypted-pdf-test.pdf');
        pdf.encrypt(newDest);

        const fileCount = fs.readdirSync(dest).length;
        expect(fileCount).toEqual(1);
    });

    it('decrypt method can throw error', () => {
        const newDest = path.join(dest, 'decrypted-pdf-test.pdf');
        pdf.decrypt(newDest);

        const fileCount = fs.readdirSync(dest).length;
        expect(fileCount).toEqual(1);
    });
});
