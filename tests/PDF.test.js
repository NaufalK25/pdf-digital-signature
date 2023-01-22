const fs = require('fs');
const PDF = require('../src/PDF');

jest.mock('../src/constant', () => {
    return {
        ...jest.requireActual('../src/constant'),
        uploadsDir: `${__dirname}/../tests/resources`
    };
});

const { uploadsDir } = require('../src/constant');

let pdf,
    pdfFile = `${uploadsDir}/pdf-test.pdf`,
    dest = `${uploadsDir}/../uploads`;

beforeAll(() => {
    fs.copyFileSync(`${uploadsDir}/test.pdf`, pdfFile);
    pdf = new PDF(pdfFile);
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
        const newDest = `${dest}/encrypted-pdf-test.pdf`;
        pdf.encrypt(newDest);

        expect(fs.existsSync(newDest)).toBeTruthy();
    });

    it('decrypt method should be working as expected', () => {
        const newDest = `${dest}/decrypted-pdf-test.pdf`;
        pdf = new PDF(`${dest}/encrypted-pdf-test.pdf`);
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
        const newDest = `${dest}/decrypted-pdf-test.pdf`;
        pdf.encrypt(newDest);

        const fileCount = fs.readdirSync(dest).length;
        expect(fileCount).toEqual(0);
    });

    it('decrypt method can throw error', () => {
        const newDest = `${dest}/decrypted-pdf-test.pdf`;
        pdf.decrypt(newDest);

        const fileCount = fs.readdirSync(dest).length;
        expect(fileCount).toEqual(0);
    });
});
