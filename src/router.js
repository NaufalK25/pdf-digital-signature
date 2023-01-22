const express = require('express');
const { decryptPDF, deleteAllPDF, deletePDF, encryptPDF, getRoot, uploadPDF } = require('./controller');
const { uploadFilesMiddleware } = require('./uploadFilesMiddleware');

const router = express.Router();

router.post('/uploads', uploadFilesMiddleware.array('files'), uploadPDF);
router.post('/delete', deletePDF);
router.post('/delete-all', deleteAllPDF);
router.post('/encrypt', encryptPDF);
router.post('/decrypt', decryptPDF);
router.get('/', getRoot);

module.exports = router;
