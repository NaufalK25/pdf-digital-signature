const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');
const router = require('./router');
const { rootDir, uploadsDir } = require('./utils/constant');

const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));
app.use(cookieParser('secret'));
app.use(
    session({
        secret: process.env.SESSION_SECRET || 'secret',
        resave: false,
        saveUninitialized: false
    })
);
app.use(flash());
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(router);

module.exports = app;
