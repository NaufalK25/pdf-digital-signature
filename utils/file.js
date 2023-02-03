const fs = require('fs');
const path = require('path');

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath
 */
const createDir = dirPath => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

/**
 * Clear directory
 * @param {string} dirPath
 * @param {string[]} except
 */
const clearDir = (dirPath, except = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (except.includes(file)) {
            return;
        }

        fs.unlinkSync(path.join(dirPath, file));
    });
};

module.exports = {
    createDir,
    clearDir
};
