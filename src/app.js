const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const router = require('./router');
const { rootDir, uploadsDir } = require('../src/constant');

const app = express();

app.set('view engine', 'ejs');
// app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(rootDir, 'public')));
app.use('/uploads', express.static(uploadsDir));
app.use(router);

module.exports = app;
