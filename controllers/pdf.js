const fs = require('fs');
const path = require('path');
const express = require('express');
const PDF = require('../utils/PDF');
const { deleteFromCloud, getFilesFromCloud, uploadToCloud } = require('../utils/cloud');
const { uploadsDir } = require('../utils/constant');

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
                isEncrypted: pdfBytes.slice(0, 7).some((val, i) => val !== PDF.validPDFBuffer[i]),
                isHashed: false
            };
        });

    res.render('index', { pdfs });
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

    res.redirect('/');
};

/**
 * Delete a PDF file controller
 * @param {express.Request} req
 * @param {express.Response} res
 */
const deletePDF = async (req, res) => {
    const file = req.body.deleted_file;

    // await deleteFromCloud(path.join(uploadsDir, file));
    fs.unlinkSync(path.join(uploadsDir, file));

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

    uploadsDirContent.filter(file => path.parse(file).ext === '.pdf').forEach(file => fs.unlinkSync(path.join(uploadsDir, file)));

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
