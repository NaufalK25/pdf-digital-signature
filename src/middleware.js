const multer = require('multer');

const uploadFilesMiddleware = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf') {
                return cb(new Error('Only PDF files are allowed!'));
            }
            cb(null, 'uploads');
        },
        filename: (req, file, cb) => {
            const { originalname } = file;
            cb(null, `${Date.now()}-${originalname}`);
        }
    })
}).array('files');

module.exports = uploadFilesMiddleware;
