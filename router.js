const express = require('express');
const { getLogin, getRegister, postLogin, postLogout, postRegister } = require('./controllers/auth');
const { compareHashPDF, deleteAllPDF, deletePDF, getAbout, getRoot, signPDF, uploadPDF } = require('./controllers/pdf');
const { alreadyLoggedIn, notLoggedIn } = require('./middlewares/authMiddleware');
const { uploadPDFMiddleware } = require('./middlewares/uploadPDFMiddleware');
const { loginValidator, publicKeyValidator, registerValidator } = require('./middlewares/validatorMiddleware');

const router = express.Router();

// Auth
router.get('/register', alreadyLoggedIn, getRegister);
router.get('/login', alreadyLoggedIn, getLogin);
router.post('/register', registerValidator, postRegister);
router.post('/login', loginValidator, postLogin);
router.post('/logout', notLoggedIn, postLogout);

// PDF
router.post('/uploads', uploadPDFMiddleware.array('files'), uploadPDF);
router.delete('/delete', deletePDF);
router.delete('/delete-all', deleteAllPDF);
router.post('/sign', publicKeyValidator, signPDF);
router.post('/compare-hash', uploadPDFMiddleware.single('normal_pdf'), publicKeyValidator, compareHashPDF);
router.get('/about', getAbout);
router.get('/', getRoot);

router.get('*', (req, res) => {
    res.redirect('/');
});
router.all('*', (req, res) => {
    req.flash('type', 'danger');
    req.flash('message', 'Metode tidak diperbolehkan');
    res.redirect('/');
});

module.exports = router;
