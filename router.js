const express = require('express');
const { decryptPDF, deleteAllPDF, deletePDF, encryptPDF, getRoot, uploadPDF } = require('./controllers/pdf');
const { uploadPDFSMiddleware } = require('./middlewares/uploadPDFSMiddleware');

const router = express.Router();

router.post('/uploads', uploadPDFSMiddleware.array('files'), uploadPDF);
router.delete('/delete', deletePDF);
router.delete('/delete-all', deleteAllPDF);
router.post('/encrypt', encryptPDF);
router.post('/decrypt', decryptPDF);
router.get('/', getRoot);

module.exports = router;
