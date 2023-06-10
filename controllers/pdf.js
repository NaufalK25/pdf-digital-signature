const fs = require('fs');
const path = require('path');
const PDF = require('../utils/PDF');
const { uploadsDir } = require('../config/constant');
const { UploadedPDF, User } = require('../database/models');

class PDFController {
    async getRoot(req, res) {
        let pdfs = [];

        if (req.user) {
            pdfs = await UploadedPDF.findByUploaderId(req.user.id);
        }

        res.render('index', {
            pdfs,
            title: 'PDF Digital Signature',
            activeNav: 'home',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    }

    getAbout(req, res) {
        res.render('about', {
            title: 'Tentang | PDF Digital Signature',
            activeNav: 'about',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    }

    async signPDF(req, res) {
        const publicKey = req.body.public_key;
        const pdf = req.body.signed_pdf;

        if (!publicKey) {
            req.flash('type', 'danger');
            req.flash('message', 'Kunci publik tidak boleh kosong');
            return res.redirect('/');
        }

        if (publicKey.length <= 0 || publicKey.length > 32) {
            req.flash('type', 'danger');
            req.flash('message', 'Panjang kunci publik harus 1-32 karakter');
            return res.redirect('/');
        }

        const privateKey = await User.generatePrivateKey(req.user.username);
        await new PDF(path.join(uploadsDir, pdf)).sign(req, privateKey, publicKey);

        req.flash('type', 'success');
        req.flash('message', `File ${pdf} berhasil ditandatangani`);
        res.redirect('/');
    }

    async compareHashPDF(req, res) {
        const hashedPDF = req.body.hashed_pdf;
        const normalPDF = req.file;
        const publicKey = req.body.public_key;

        if (!hashedPDF) {
            req.flash('type', 'danger');
            req.flash('message', 'PDF hash tidak boleh kosong');
            return res.redirect('/');
        }

        if (!normalPDF) {
            req.flash('type', 'danger');
            req.flash('message', 'PDF normal tidak boleh kosong');
            return res.redirect('/');
        }

        if (!publicKey) {
            req.flash('type', 'danger');
            req.flash('message', 'Kunci publik tidak boleh kosong');
            return res.redirect('/');
        }

        if (publicKey.length <= 0 || publicKey.length > 32) {
            req.flash('type', 'danger');
            req.flash('message', 'Panjang kunci publik harus 1-32 karakter');
            return res.redirect('/');
        }

        const privateKey = await User.generatePrivateKey(req.user.username);
        const checksumHashedPDF = await new PDF(path.join(uploadsDir, hashedPDF)).decrypt(req, privateKey);
        const checksumNormalPDF = new PDF(normalPDF.path).hash(publicKey);
        const isSame = checksumHashedPDF === checksumNormalPDF;

        req.flash('type', isSame ? 'success' : 'danger');
        req.flash(
            'message',
            `${hashedPDF} dan ${normalPDF.filename} adalah file yang ${isSame ? 'sama' : 'berbeda'}<br>PDF hash: ${checksumHashedPDF}<br>PDF normal: ${checksumNormalPDF}`
        );

        fs.unlinkSync(normalPDF.path);

        res.redirect('/');
    }

    async uploadPDF(req, res) {
        if (req.files.length <= 0) {
            req.flash('type', 'danger');
            req.flash('message', 'File tidak boleh kosong');
            return res.redirect('/');
        }

        for (const file of req.files) {
            await UploadedPDF.create({
                uploaderId: req.user.id,
                name: file.filename,
                url: path.join('uploads', file.filename)
            });
        }

        req.flash('type', 'success');
        req.flash('message', `Berhasil mengunggah ${req.files.length} file`);
        res.redirect('/');
    }

    async deletePDF(req, res) {
        const pdf = req.body.deleted_pdf;

        await UploadedPDF.deleteByPDFName(req.user.id, pdf);
        fs.unlinkSync(path.join(uploadsDir, pdf));

        req.flash('type', 'success');
        req.flash('message', `Berhasil menghapus ${pdf}`);
        res.redirect('/');
    }

    async deleteAllPDF(req, res) {
        const loggedInUserPDFs = await UploadedPDF.findByUploaderId(req.user.id);
        const loggedInUserPDFsName = loggedInUserPDFs.map(pdf => pdf.name);
        const uploadsDirContent = fs.readdirSync(uploadsDir);

        const fileCount = await UploadedPDF.deleteByUploaderId(req.user.id);
        uploadsDirContent
            .filter(file => loggedInUserPDFsName.includes(file))
            .forEach(pdf => {
                fs.unlinkSync(path.join(uploadsDir, pdf));
            });

        req.flash('type', 'success');
        req.flash('message', `Berhasil menghapus ${fileCount} file`);
        res.redirect('/');
    }
}

module.exports = PDFController;
