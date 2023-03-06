const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const router = require('./router');
const initializePassport = require('./config/passport');
const { rootDir, uploadsDir } = require('./config/constant');

const app = express();

initializePassport();

app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser('secret'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
        }
    })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(router);

module.exports = app;
