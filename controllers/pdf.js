const fs = require('fs');
const path = require('path');
const express = require('express');
const PDF = require('../utils/PDF');
const { deleteFromCloud, getFilesFromCloud, uploadToCloud } = require('../utils/cloud');
const { uploadsDir } = require('../utils/constant');
const { getPublicKey, removePublicKey } = require('../utils/publicKey');

/**
 * Get the root page controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const getRoot = async (req, res) => {
    // const pdfs = await getFilesFromCloud();

    // pdfs.sort((a, b) => (a.name > b.name ? -1 : 1)).forEach(pdf => {
    //     const filePath = path.join(uploadsDir, pdf.name);
    //     const file = fs.readFileSync(filePath);
    //     const fileBufferArr = file.toJSON().data;
    //     pdf.isEncrypted = fileBufferArr.slice(0, 7).some((val, i) => val !== PDF.validPDFBuffer[i]);
    // });

    const pdfs = fs
        .readdirSync(uploadsDir)
        .filter(pdf => path.parse(pdf).ext === '.pdf')
        .sort((a, b) => (a > b ? -1 : 1))
        .map(pdf => {
            const pdfPath = path.join(uploadsDir, pdf);
            const pdfBuffer = fs.readFileSync(pdfPath);
            const pdfBytes = pdfBuffer.toJSON().data;

            return {
                name: pdf,
                url: path.join('uploads', pdf),
                isEncrypted: pdfBytes.length >= PDF.minPDFBufferLength && pdfBytes.slice(0, 7).some((val, i) => val !== PDF.validPDFBuffer[i]),
                isHashed: pdfBytes.length < PDF.minPDFBufferLength,
                publicKey: getPublicKey(pdf)
            };
        });

    res.render('index', {
        pdfs,
        flash: {
            type: req.flash('type') || '',
            message: req.flash('message') || ''
        }
    });
};

/**
 * Encrypt a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const encryptPDF = async (req, res) => {
    let file = req.body.encrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('decrypted-')) {
        file = file.replace('decrypted-', '');
    }

    await pdf.encrypt(path.join(uploadsDir, `encrypted-${file}`));

    req.flash('type', 'success');
    req.flash('message', `Successfully encrypted ${file}`);

    res.redirect('/');
};

/**
 * Decrypt a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const decryptPDF = async (req, res) => {
    let file = req.body.decrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('encrypted-')) {
        file = file.replace('encrypted-', '');
    }

    await pdf.decrypt(path.join(uploadsDir, `decrypted-${file}`));

    req.flash('type', 'success');
    req.flash('message', `Successfully decrypted ${file}`);

    res.redirect('/');
};

/**
 * Hash a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const hashPDF = async (req, res) => {
    const publicKey = req.body.public_key;
    const file = req.body.hashed_file;
    const pdf = new PDF(path.join(uploadsDir, file));

    await pdf.hash(publicKey, path.join(uploadsDir, `hashed-${file}`));

    req.flash('type', 'success');
    req.flash('message', `Successfully hashed ${file}`);

    res.redirect('/');
};

/**
 * Compare hash of 2 PDF files controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const compareHashPDF = async (req, res) => {
    const file1 = req.body.file1;
    const file2 = req.body.file2;

    const pdf1 = fs.readFileSync(path.join(uploadsDir, file1));
    const pdf2 = fs.readFileSync(path.join(uploadsDir, file2));

    const pdf1Buffer = pdf1.toJSON().data;
    const pdf2Buffer = pdf2.toJSON().data;

    const isSame = pdf1Buffer.length === pdf2Buffer.length && pdf1Buffer.every((val, i) => val === pdf2Buffer[i]);

    req.flash('type', isSame ? 'success' : 'danger');
    req.flash('message', `${file1} and ${file2} are ${isSame ? '' : 'not '}the same file(s)`);

    res.redirect('/');
};

/**
 * Upload a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const uploadPDF = async (req, res) => {
    // for (const file of req.files) {
    //     await uploadToCloud(file.path, file.filename);
    // }

    req.flash('type', 'success');
    req.flash('message', `Successfully uploaded ${req.files.length} file(s)`);
    res.redirect('/');
};

/**
 * Delete a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deletePDF = async (req, res) => {
    const file = req.body.deleted_file;

    removePublicKey(file);

    // await deleteFromCloud(path.join(uploadsDir, file));
    fs.unlinkSync(path.join(uploadsDir, file));

    req.flash('type', 'success');
    req.flash('message', `Successfully deleted ${file}`);
    res.redirect('/');
};

/**
 * Delete all PDF files controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deleteAllPDF = async (req, res) => {
    // const pdfs = await getFilesFromCloud();

    // pdfs.forEach(async pdf => await deleteFromCloud(path.join(uploadsDir, pdf.name)));

    const uploadsDirContent = fs.readdirSync(uploadsDir);

    uploadsDirContent
        .filter(file => path.parse(file).ext === '.pdf')
        .forEach(file => {
            removePublicKey(file);
            fs.unlinkSync(path.join(uploadsDir, file));
        });

    req.flash('type', 'success');
    req.flash('message', `Successfully deleted ${uploadsDirContent.length - 1} file(s)`);

    res.redirect('/');
};

module.exports = {
    getRoot,
    encryptPDF,
    decryptPDF,
    hashPDF,
    compareHashPDF,
    uploadPDF,
    deletePDF,
    deleteAllPDF
};
