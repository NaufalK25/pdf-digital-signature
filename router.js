const express = require('express');
const AuthController = require('./controllers/auth');
const PDFController = require('./controllers/pdf');
const { alreadyLoggedIn, notLoggedIn } = require('./middlewares/authMiddleware');
const { uploadPDFMiddleware } = require('./middlewares/uploadPDFMiddleware');
const { loginValidator, publicKeyValidator, registerValidator } = require('./middlewares/validatorMiddleware');

const router = express.Router();
const authController = new AuthController();
const pdfController = new PDFController();

// Auth
router.get('/register', alreadyLoggedIn, authController.getRegister);
router.get('/login', alreadyLoggedIn, authController.getLogin);
router.post('/register', registerValidator, authController.postRegister);
router.post('/login', loginValidator, authController.postLogin);
router.post('/logout', notLoggedIn, authController.postLogout);

// PDF
router.post('/uploads', uploadPDFMiddleware.array('files'), pdfController.uploadPDF);
router.delete('/delete', pdfController.deletePDF);
router.delete('/delete-all', pdfController.deleteAllPDF);
router.post('/sign', publicKeyValidator, pdfController.signPDF);
router.post('/compare-hash', uploadPDFMiddleware.single('normal_pdf'), publicKeyValidator, pdfController.compareHashPDF);
router.get('/', pdfController.getRoot);

router.get('*', (req, res) => {
    res.redirect('/');
});
router.all('*', (req, res) => {
    req.flash('type', 'danger');
    req.flash('message', 'Method not allowed');
    res.redirect('/');
});

module.exports = router;
