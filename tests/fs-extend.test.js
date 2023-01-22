const fs = require('fs');
const { clearDir, createDir, deleteFile, getDirFromPath, getFilenameFromPath, splitDirAndFilename } = require('../src/fs-extend');

const testDir = './tests';
const uploadsDir = `${testDir}/uploads`;

afterAll(() => {
    if (!fs.existsSync(`${uploadsDir}/.gitkeep`)) {
        fs.writeFileSync(`${uploadsDir}/.gitkeep`, '');
    }

    clearDir(uploadsDir, ['.gitkeep']);
});

describe('clearDir function', () => {
    beforeEach(() => {
        fs.writeFileSync(`${uploadsDir}/file1.txt`, 'file1');
        fs.writeFileSync(`${uploadsDir}/file2.txt`, 'file2');
    });

    afterEach(() => {
        expect(fs.existsSync(`${uploadsDir}/file1.txt`)).toBeFalsy();
        expect(fs.existsSync(`${uploadsDir}/file2.txt`)).toBeFalsy();
    });

    it('should clear directory', () => {
        expect(fs.existsSync(`${uploadsDir}/file1.txt`)).toBeTruthy();
        expect(fs.existsSync(`${uploadsDir}/file2.txt`)).toBeTruthy();

        clearDir(uploadsDir);
    });

    it('should clear directory except specific file(s)', () => {
        fs.writeFileSync(`${uploadsDir}/.gitkeep`, '');

        expect(fs.existsSync(`${uploadsDir}/file1.txt`)).toBeTruthy();
        expect(fs.existsSync(`${uploadsDir}/file2.txt`)).toBeTruthy();
        expect(fs.existsSync(`${uploadsDir}/.gitkeep`)).toBeTruthy();

        clearDir(uploadsDir, ['.gitkeep']);

        expect(fs.existsSync(`${uploadsDir}/.gitkeep`)).toBeTruthy();

        deleteFile(`${uploadsDir}/.gitkeep`);
    });
});

describe('createDir function', () => {
    it('should create directory', () => {
        const tempDir = `${testDir}/temp`;

        createDir(tempDir);

        expect(fs.existsSync(tempDir)).toBeTruthy();

        fs.rmdirSync(tempDir);
    });
});

describe('deleteFile function', () => {
    it('should delete file', () => {
        fs.writeFileSync(`${uploadsDir}/file1.txt`, 'file1');

        expect(fs.existsSync(`${uploadsDir}/file1.txt`)).toBeTruthy();

        deleteFile(`${uploadsDir}/file1.txt`);

        expect(fs.existsSync(`${uploadsDir}/file1.txt`)).toBeFalsy();
    });
});

describe('getDirFromPath function', () => {
    it('should get directory from path', () => {
        const filePath = `${uploadsDir}/file1.txt`;
        const dir = getDirFromPath(filePath);

        expect(dir).toBe(uploadsDir);
    });
});

describe('getFilenameFromPath function', () => {
    it('should get filename from path', () => {
        const filePath = `${uploadsDir}/file1.txt`;
        const filename = getFilenameFromPath(filePath);

        expect(filename).toBe('file1.txt');
    });
});

describe('splitDirAndFilename function', () => {
    it('should split directory and filename', () => {
        const filePath = `${uploadsDir}/file1.txt`;
        const { dir, base } = splitDirAndFilename(filePath);

        expect(dir).toBe(uploadsDir);
        expect(base).toBe('file1.txt');
    });
});
