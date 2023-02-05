const express = require('express');
const { compareHashPDF, deleteAllPDF, deletePDF, getRoot, signPDF, uploadPDF } = require('./controllers/pdf');
const { uploadPDFSMiddleware } = require('./middlewares/uploadPDFSMiddleware');

const router = express.Router();

router.post('/uploads', uploadPDFSMiddleware.array('files'), uploadPDF);
router.delete('/delete', deletePDF);
router.delete('/delete-all', deleteAllPDF);
router.post('/sign', signPDF);
router.post('/compare-hash', uploadPDFSMiddleware.single('normal_pdf'), compareHashPDF);
router.get('/', getRoot);

router.get('*', (req, res) => {
    res.redirect('/');
});

module.exports = router;
