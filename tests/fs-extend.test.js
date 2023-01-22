const fs = require('fs');
const { clearDir, createDir, deleteFile, getDirFromPath, getFilenameFromPath, splitDirAndFilename } = require('../src/fs-extend');

const testDir = './tests';
const playgroundDir = `${testDir}/uploads`;

afterAll(() => {
    clearDir(playgroundDir);
});

describe('clearDir function', () => {
    beforeEach(() => {
        fs.writeFileSync(`${playgroundDir}/file1.txt`, 'file1');
        fs.writeFileSync(`${playgroundDir}/file2.txt`, 'file2');
    });

    afterEach(() => {
        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBeFalsy()
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBeFalsy()
    });

    it('should clear directory', () => {
        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBeTruthy();
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBeTruthy();

        clearDir(playgroundDir);
    });

    it('should clear directory except specific file(s)', () => {
        fs.writeFileSync(`${playgroundDir}/.gitkeep`, '');

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBeTruthy();
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBeTruthy();
        expect(fs.existsSync(`${playgroundDir}/.gitkeep`)).toBeTruthy();

        clearDir(playgroundDir, ['.gitkeep']);

        expect(fs.existsSync(`${playgroundDir}/.gitkeep`)).toBeTruthy();

        deleteFile(`${playgroundDir}/.gitkeep`);
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
        fs.writeFileSync(`${playgroundDir}/file1.txt`, 'file1');

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBeTruthy();

        deleteFile(`${playgroundDir}/file1.txt`);

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBeFalsy();
    });
});

describe('getDirFromPath function', () => {
    it('should get directory from path', () => {
        const filePath = `${playgroundDir}/file1.txt`;
        const dir = getDirFromPath(filePath);

        expect(dir).toBe(playgroundDir);
    });
});

describe('getFilenameFromPath function', () => {
    it('should get filename from path', () => {
        const filePath = `${playgroundDir}/file1.txt`;
        const filename = getFilenameFromPath(filePath);

        expect(filename).toBe('file1.txt');
    });
});

describe('splitDirAndFilename function', () => {
    it('should split directory and filename', () => {
        const filePath = `${playgroundDir}/file1.txt`;
        const { dir, base } = splitDirAndFilename(filePath);

        expect(dir).toBe(playgroundDir);
        expect(base).toBe('file1.txt');
    });
});
