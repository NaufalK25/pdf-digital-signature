const fs = require('fs');
const path = require('path');
const PDF = require('../utils/PDF');
const { uploadsDir } = require('../config/constant');
const { getData, isDataExist, removeData } = require('../utils/data');

const getRoot = (req, res) => {
    const pdfs = fs
        .readdirSync(uploadsDir)
        .filter(pdf => path.parse(pdf).ext === '.pdf')
        .sort((a, b) => (a > b ? -1 : 1))
        .map(pdf => ({
            name: pdf,
            url: path.join('uploads', pdf),
            isHashed: isDataExist(pdf),
            data: getData(pdf)
        }));

    res.render('index', {
        pdfs,
        title: 'PDF Digital Signature',
        activeNav: 'home',
        loggedInUser: req.user || null,
        flash: {
            type: req.flash('type') || '',
            message: req.flash('message') || ''
        }
    });
};

const signPDF = (req, res) => {
    const privateKey = req.body.private_key;
    const publicKey = req.body.public_key;
    const pdf = req.body.signed_pdf;

    if (!privateKey) {
        req.flash('type', 'danger');
        req.flash('message', 'Please enter a private key');
        return res.redirect('/');
    }

    if (!publicKey) {
        req.flash('type', 'danger');
        req.flash('message', 'Please enter a public key');
        return res.redirect('/');
    }

    if (publicKey.length <= 0 || publicKey.length > 32) {
        req.flash('type', 'danger');
        req.flash('message', 'Public Key must be 1-32 characters long');
        return res.redirect('/');
    }

    new PDF(path.join(uploadsDir, pdf)).sign(privateKey, publicKey);

    req.flash('type', 'success');
    req.flash('message', `File ${pdf} has been signed`);

    res.redirect('/');
};

const compareHashPDF = (req, res) => {
    const privateKey = req.body.private_key;
    const publicKey = req.body.public_key;
    const hashedPDF = req.body.hashed_pdf;
    const normalPDF = req.file;

    if (!hashedPDF) {
        req.flash('type', 'danger');
        req.flash('message', 'Please select a hashed PDF file');
        return res.redirect('/');
    }

    if (!normalPDF) {
        req.flash('type', 'danger');
        req.flash('message', 'Please upload a normal PDF file');
        return res.redirect('/');
    }

    const checksumHashedPDF = new PDF(path.join(uploadsDir, hashedPDF)).decrypt(privateKey);
    const checksumNormalPDF = new PDF(normalPDF.path).hash(publicKey);

    const isSame = checksumHashedPDF === checksumNormalPDF;

    req.flash('type', isSame ? 'success' : 'danger');
    req.flash('message', `${hashedPDF} and ${normalPDF.filename} are ${isSame ? '' : 'not '}the same file`);

    fs.unlinkSync(normalPDF.path);

    res.redirect('/');
};

const uploadPDF = (req, res) => {
    if (req.files.length <= 0) {
        req.flash('type', 'danger');
        req.flash('message', 'Please select one or more files to upload');
        return res.redirect('/');
    }

    req.flash('type', 'success');
    req.flash('message', `Successfully uploaded ${req.files.length} file(s)`);
    res.redirect('/');
};

const deletePDF = (req, res) => {
    const pdf = req.body.deleted_pdf;

    removeData(pdf);
    fs.unlinkSync(path.join(uploadsDir, pdf));

    req.flash('type', 'success');
    req.flash('message', `Successfully deleted ${pdf}`);
    res.redirect('/');
};

const deleteAllPDF = (req, res) => {
    const uploadsDirContent = fs.readdirSync(uploadsDir);

    uploadsDirContent
        .filter(file => path.parse(file).ext === '.pdf')
        .forEach(pdf => {
            removeData(pdf);
            fs.unlinkSync(path.join(uploadsDir, pdf));
        });

    req.flash('type', 'success');
    req.flash('message', `Successfully deleted ${uploadsDirContent.length - 1} file(s)`);
    res.redirect('/');
};

module.exports = {
    getRoot,
    signPDF,
    compareHashPDF,
    uploadPDF,
    deletePDF,
    deleteAllPDF
};
