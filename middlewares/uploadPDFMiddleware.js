const express = require('express');
const multer = require('multer');

/**
 * Set the destination of the uploaded file
 * @param {express.Request} req
 * @param {Express.Multer.File} file
 * @param {(error: Error | null, destination: string) => void} cb
 * @returns
 */
const destination = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only PDF files are allowed!'));
    }
    cb(null, 'uploads');
};

/**
 * Set the filename of the uploaded file
 * @param {express.Request} req
 * @param {Express.Multer.File} file
 * @param {(error: Error | null, filename: string) => void} cb
 */
const filename = (req, file, cb) => {
    const { originalname } = file;
    cb(null, `${Date.now()}-${originalname}`);
};

const storage = multer.diskStorage({
    destination,
    filename
});

const uploadPDFMiddleware = multer({ storage });

module.exports = {
    destination,
    filename,
    storage,
    uploadPDFMiddleware
};
