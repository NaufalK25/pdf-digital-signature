const fs = require('fs');
const path = require('path');
const PDF = require('./PDF');
const { uploadsDir } = require('./utils/constant');
const { deleteFile } = require('./utils/file');

const getRoot = (req, res) => {
    const uploadsDirContent = fs.readdirSync(uploadsDir);
    const pdfs = [];

    uploadsDirContent
        .filter(file => path.parse(file).ext === '.pdf')
        .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
        .forEach(file => {
            const validPdfBuffer = [37, 80, 68, 70, 45, 49, 46];
            const pdfBuffer = fs.readFileSync(path.join(uploadsDir, file));
            const isEncrypted = validPdfBuffer.some((byte, index) => pdfBuffer[index] !== byte);

            pdfs.push({
                name: file,
                isEncrypted
            });
        });

    res.render('index', { pdfs });
};

const encryptPDF = (req, res) => {
    let file = req.body.encrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('decrypted-')) {
        file = file.replace('decrypted-', '');
    }

    pdf.encrypt(path.join(uploadsDir, `encrypted-${file}`));

    res.redirect('/');
};

const decryptPDF = (req, res) => {
    let file = req.body.decrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('encrypted-')) {
        file = file.replace('encrypted-', '');
    }

    pdf.decrypt(path.join(uploadsDir, `decrypted-${file}`));

    res.redirect('/');
};

const uploadPDF = (req, res) => {
    res.redirect('/');
};

const deletePDF = (req, res) => {
    const file = req.body.deleted_file;
    deleteFile(path.join(uploadsDir, file));
    res.redirect('/');
};

const deleteAllPDF = (req, res) => {
    const uploadsDirContent = fs.readdirSync(uploadsDir);

    uploadsDirContent.filter(file => path.parse(file).ext === '.pdf').forEach(file => deleteFile(path.join(uploadsDir, file)));

    res.redirect('/');
};

module.exports = {
    getRoot,
    encryptPDF,
    decryptPDF,
    uploadPDF,
    deletePDF,
    deleteAllPDF
};
