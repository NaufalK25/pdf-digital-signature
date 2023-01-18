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
const rootDir = path.join(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');

app.set('view engine', 'ejs');
// app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(uploadsDir));

app.get('/', (req, res) => {
    const uploadsDirContent = fs.readdirSync(uploadsDir);
    const pdfs = [];

    uploadsDirContent
        .filter(file => path.parse(file).ext === '.pdf')
        .sort((a, b) => (a < b ? 1 : a > b ? -1 : 0))
        .forEach(file => {
            const validPdfBuffer = [37, 80, 68, 70, 45, 49, 46];
            const pdfBuffer = fs.readFileSync(path.join(uploadsDir, file));
            const isEncrypted = validPdfBuffer.some((byte, index) => pdfBuffer[index] !== byte);

            pdfs.push({
                name: file,
                isEncrypted
            });
        });

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
    deleteFile(path.join(uploadsDir, file));
    res.redirect('/');
});

app.post('/encrypt', (req, res) => {
    let file = req.body.encrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('decrypted-')) {
        file = file.replace('decrypted-', '');
    }

    pdf.encrypt(path.join(uploadsDir, `encrypted-${file}`));

    res.redirect('/');
});

app.post('/decrypt', (req, res) => {
    let file = req.body.decrypted_file;

    const pdf = new PDF(path.join(uploadsDir, file));

    if (file.startsWith('encrypted-')) {
        file = file.replace('encrypted-', '');
    }

    pdf.decrypt(path.join(uploadsDir, `decrypted-${file}`));

    res.redirect('/');
});

app.listen(port, () => {
    console.log(`Server running at ${baseUrl}:${port}`);
});
