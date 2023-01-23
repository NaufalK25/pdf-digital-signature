const path = require('path');
require('dotenv').config();

const port = process.env.PORT || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost';

const rootDir = path.join(__dirname, '..');
let uploadsDir = path.join(rootDir, 'uploads');

module.exports = {
    port,
    baseUrl,
    rootDir,
    uploadsDir
};
