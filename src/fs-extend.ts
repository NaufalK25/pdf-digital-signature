import fs from 'fs';

export const createDir = (dirPath: string, recursive: boolean = true) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive });
    }
};

export const splitDirAndFilename = (filePath: string) => {
    const [filename, ...dirArr] = filePath.split('/').reverse();
    const dir = dirArr.reverse().join('/');

    return { filename, dir };
};

export const getDirFromPath = (filePath: string) => {
    return splitDirAndFilename(filePath).dir;
};

export const getFilenameFromPath = (filePath: string) => {
    return splitDirAndFilename(filePath).filename;
};

export const clearDir = (dirPath: string) => {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
        fs.unlinkSync(`${dirPath}/${file}`);
    });
};
