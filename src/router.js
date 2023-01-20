const express = require('express');
const uploadFilesMiddleware = require('./middleware');
const { decryptPDF, deleteAllPDF, deletePDF, encryptPDF, getRoot, uploadPDF } = require('./controller');

const router = express.Router();

router.post('/uploads', uploadFilesMiddleware, uploadPDF);
router.post('/delete', deletePDF);
router.post('/delete-all', deleteAllPDF);
router.post('/encrypt', encryptPDF);
router.post('/decrypt', decryptPDF);
router.get('/', getRoot);

module.exports = router;
