const fs = require('fs');
const path = require('path');
const PDF = require('../utils/PDF');
const { uploadsDir } = require('../config/constant');
const { UploadedPDF, User } = require('../database/models');

const getRoot = async (req, res) => {
    let pdfs = [];

    if (req.user) {
        const loggedInUserPDFs = await UploadedPDF.findByUploaderId(req.user.id);

        pdfs = loggedInUserPDFs.map(({ name, url, isHashed, checksum, publicKey }) => ({
            name,
            url,
            isHashed,
            checksum,
            publicKey
        }));
    }

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

const signPDF = async (req, res) => {
    const publicKey = req.body.public_key;
    const pdf = req.body.signed_pdf;

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

    const privateKey = await User.generatePrivateKey(req.user.username);
    await new PDF(path.join(uploadsDir, pdf)).sign(req, privateKey, publicKey);

    req.flash('type', 'success');
    req.flash('message', `File ${pdf} has been signed`);

    res.redirect('/');
};

const compareHashPDF = async (req, res) => {
    const hashedPDF = req.body.hashed_pdf;
    const normalPDF = req.file;
    const publicKey = req.body.public_key;

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

    const privateKey = await User.generatePrivateKey(req.user.username);
    const checksumHashedPDF = await new PDF(path.join(uploadsDir, hashedPDF)).decrypt(req, privateKey);
    const checksumNormalPDF = new PDF(normalPDF.path).hash(publicKey);
    const isSame = checksumHashedPDF === checksumNormalPDF;

    req.flash('type', isSame ? 'success' : 'danger');
    req.flash('message', `${hashedPDF} and ${normalPDF.filename} are ${isSame ? '' : 'not '}the same file`);

    fs.unlinkSync(normalPDF.path);

    res.redirect('/');
};

const uploadPDF = async (req, res) => {
    if (req.files.length <= 0) {
        req.flash('type', 'danger');
        req.flash('message', 'Please select one or more files to upload');
        return res.redirect('/');
    }

    for (const file of req.files) {
        await UploadedPDF.create({
            uploaderId: req.user.id,
            name: file.filename,
            url: path.join('uploads', file.filename)
        });
    }

    req.flash('type', 'success');
    req.flash('message', `Successfully uploaded ${req.files.length} file(s)`);
    res.redirect('/');
};

const deletePDF = async (req, res) => {
    const pdf = req.body.deleted_pdf;

    await UploadedPDF.deleteByPDFName(req.user.id, pdf);
    fs.unlinkSync(path.join(uploadsDir, pdf));

    req.flash('type', 'success');
    req.flash('message', `Successfully deleted ${pdf}`);
    res.redirect('/');
};

const deleteAllPDF = async (req, res) => {
    const loggedInUserPDFs = await UploadedPDF.findByUploaderId(req.user.id);
    const loggedInUserPDFsName = loggedInUserPDFs.map(pdf => pdf.name);
    const uploadsDirContent = fs.readdirSync(uploadsDir);

    await UploadedPDF.deleteByUploaderId(req.user.id);
    uploadsDirContent
        .filter(file => loggedInUserPDFsName.includes(file))
        .forEach(pdf => {
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
