const fs = require('fs');
const path = require('path');

const createDir = dirPath => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const splitDirAndFilename = filePath => {
    return path.parse(filePath);
};

const getDirFromPath = filePath => {
    return splitDirAndFilename(filePath).dir;
};

const getFilenameFromPath = filePath => {
    return splitDirAndFilename(filePath).base;
};

const clearDir = (dirPath, except = []) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        if (except.includes(file)) {
            return;
        }

        deleteFile(path.join(dirPath, file));
    });
};

const deleteFile = filePath => {
    fs.unlinkSync(filePath);
};

module.exports = {
    createDir,
    splitDirAndFilename,
    getDirFromPath,
    getFilenameFromPath,
    clearDir,
    deleteFile
};
