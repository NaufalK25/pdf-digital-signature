require('dotenv').config();
const path = require('path');

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost';

const rootDir = path.join(__dirname, '..');
const uploadsDir = path.join(rootDir, 'uploads');

module.exports = {
    port,
    baseUrl,
    rootDir,
    uploadsDir
};
