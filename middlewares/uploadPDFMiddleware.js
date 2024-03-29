const multer = require('multer');

const destination = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Hanya file PDF yang diperbolehkan'));
    }
    cb(null, 'uploads');
};

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
