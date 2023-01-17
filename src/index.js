const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const multer = require('multer');
const PDF = require('./PDF');
const { deleteFile } = require('./fs-extend');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost';

app.set('view engine', 'ejs');
// app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
    const uploadsDir = fs.readdirSync(path.join(__dirname, '..', 'uploads'));
    const pdfs = uploadsDir.filter(file => path.parse(file).ext === '.pdf');

    res.render('index', { pdfs });
});

app.post(
    '/uploads',
    multer({
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
    }).array('files'),
    (req, res) => {
        res.redirect('/');
    }
);

app.post('/delete', (req, res) => {
    const file = req.body.deleted_file;
    deleteFile(path.join(__dirname, '..', 'uploads', file));
    res.redirect('/');
});

app.post('/encrypt', (req, res) => {
    const file = req.body.encrypted_file;
    res.redirect('/');
});

app.post('/decrypt', (req, res) => {
    const file = req.body.decrypted_file;
    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at ${baseUrl}:${port}`);
});
