const bcrypt = require('bcrypt');
const express = require('express');
const { validationResult } = require('express-validator');
const passport = require('../middlewares/passportLocalMiddleware');
const { User } = require('../database/models');

const getRegister = (req, res) => {
    res.render('register', {
        title: 'Register | PDF Digital Signature',
        activeNav: 'register',
        loggedInUser: req.user || null,
        flash: {
            type: req.flash('type') || '',
            message: req.flash('message') || ''
        }
    });
};

const getLogin = (req, res) => {
    res.render('login', {
        title: 'Login | PDF Digital Signature',
        activeNav: 'login',
        loggedInUser: req.user || null,
        flash: {
            type: req.flash('type') || '',
            message: req.flash('message') || ''
        }
    });
};

const postLogout = (req, res) => {
    req.logout(err => {
        if (err) {
            req.flash('type', 'danger');
            req.flash('message', 'Something went wrong');
            return res.redirect('/');
        }

        req.flash('type', 'success');
        req.flash('message', 'You have been logged out successfully');
        return res.redirect('/');
    });
};

const postRegister = async (req, res) => {
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
    await User.create({
        username,
        password: await bcrypt.hash(password, 10)
    });

    req.flash('type', 'success');
    req.flash('message', 'You have been registered successfully');
    res.redirect('/login');
};

const postLogin = (req, res) => {
    passport.authenticate(
        'local',
        (err, user, info) => {
            if (err) {
                req.flash('type', 'danger');
                req.flash('message', 'Something went wrong');
                return res.redirect('/login');
            }

            if (!user) {
                req.flash('type', 'danger');
                req.flash('message', info.message);
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
        }
    )(req, res);
};

module.exports = {
    getRegister,
    getLogin,
    postRegister,
    postLogin,
    postLogout
};
