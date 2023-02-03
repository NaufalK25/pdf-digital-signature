const express = require('express');
const { compareHashPDF, decryptPDF, deleteAllPDF, deletePDF, encryptPDF, getRoot, hashPDF, uploadPDF } = require('./controllers/pdf');
const { uploadPDFSMiddleware } = require('./middlewares/uploadPDFSMiddleware');

const router = express.Router();

router.post('/uploads', uploadPDFSMiddleware.array('files'), uploadPDF);
router.delete('/delete', deletePDF);
router.delete('/delete-all', deleteAllPDF);
router.post('/encrypt', encryptPDF);
router.post('/decrypt', decryptPDF);
router.post('/hash', hashPDF);
router.post('/compare-hash', compareHashPDF);
router.get('/', getRoot);

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
