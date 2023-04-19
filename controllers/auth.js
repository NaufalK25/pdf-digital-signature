const passport = require('passport');
const { validationResult } = require('express-validator');
const BLAKE2s = require('../utils/BLAKE2s');
const { User } = require('../database/models');
const { textToDec } = require('../utils/converter');

class AuthController {
    getRegister(req, res) {
        res.render('register', {
            title: 'Register | PDF Digital Signature',
            activeNav: 'register',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    }

    getLogin(req, res) {
        res.render('login', {
            title: 'Login | PDF Digital Signature',
            activeNav: 'login',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    }

    async postRegister(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            req.flash('type', 'danger');
            req.flash('message', errors.array()[0].msg);
            return res.redirect('/register');
        }

        if (req.body.password !== req.body.confirmPassword) {
            req.flash('type', 'danger');
            req.flash('message', 'Password does not match');
            return res.redirect('/register');
        }

        const { username, password } = req.body;

        const passwordBuffer = Buffer.from(password);
        const publicKey = username.padEnd(32, ' ');
        const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
        const hashedPassword = new BLAKE2s(publicKey.length, keyBuffer).update(passwordBuffer).hexDigest();

        await User.create({
            username,
            password: hashedPassword
        });

        req.flash('type', 'success');
        req.flash('message', 'You have been registered successfully');
        res.redirect('/login');
    }

    postLogin(req, res) {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                req.flash('type', 'danger');
                req.flash('message', 'Something went wrong');
                return res.redirect('/login');
            }

            if (!user) {
                req.flash('type', 'danger');
                req.flash('message', info?.message || 'Something went wrong');
                return res.redirect('/login');
            }

            req.login(user, err => {
                if (err) {
                    req.flash('type', 'danger');
                    req.flash('message', 'Something went wrong');
                    return res.redirect('/login');
                }

                const errors = validationResult(req);

                if (!errors.isEmpty()) {
                    req.flash('type', 'danger');
                    req.flash('message', errors.array()[0].msg);
                    return res.redirect('/login');
                }

                req.flash('type', 'success');
                req.flash('message', 'You have been logged in successfully');
                res.redirect('/');
            });
        })(req, res);
    }

    postLogout(req, res) {
        req.logout(err => {
            if (err) {
                req.flash('type', 'danger');
                req.flash('message', 'Something went wrong');
                return res.redirect('/');
            }

            req.flash('type', 'success');
            req.flash('message', 'You have been logged out successfully');
            res.redirect('/');
        });
    }
}

module.exports = AuthController;
