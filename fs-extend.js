const fs = require('fs');

const createDir = (dirPath, recursive = true) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive });
    }
};

const splitDirAndFilename = filePath => {
    const [filename, ...dirArr] = filePath.split('/').reverse();
    const dir = dirArr.reverse().join('/');

    return { filename, dir };
};

const getDirFromPath = filePath => {
    return splitDirAndFilename(filePath).dir;
};

const getFilenameFromPath = filePath => {
    return splitDirAndFilename(filePath).filename;
};

const clearDir = dirPath => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        fs.unlinkSync(`${dirPath}/${file}`);
    });
};

module.exports = {
    clearDir,
    createDir,
    getDirFromPath,
    getFilenameFromPath,
    splitDirAndFilename
};
