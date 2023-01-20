const fs = require('fs');
const { clearDir, createDir, deleteFile, getDirFromPath, getFilenameFromPath, splitDirAndFilename } = require('../src/fs-extend');

const testDir = './tests';
const playgroundDir = `${testDir}/playground`;

beforeAll(() => {
    createDir(playgroundDir);
});

afterAll(() => {
    fs.rmSync(playgroundDir, { recursive: true });
});

describe('clearDir function', () => {
    beforeEach(() => {
        fs.writeFileSync(`${playgroundDir}/file1.txt`, 'file1');
        fs.writeFileSync(`${playgroundDir}/file2.txt`, 'file2');
    });

    afterEach(() => {
        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBe(false);
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBe(false);
    });

    it('should clear directory', () => {
        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBe(true);
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBe(true);

        clearDir(playgroundDir);
    });

    it('should clear directory except specific file(s)', () => {
        fs.writeFileSync(`${playgroundDir}/.gitkeep`, '');

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBe(true);
        expect(fs.existsSync(`${playgroundDir}/file2.txt`)).toBe(true);
        expect(fs.existsSync(`${playgroundDir}/.gitkeep`)).toBe(true);

        clearDir(playgroundDir, ['.gitkeep']);

        expect(fs.existsSync(`${playgroundDir}/.gitkeep`)).toBe(true);

        deleteFile(`${playgroundDir}/.gitkeep`);
    });
});

describe('createDir function', () => {
    it('should create directory', () => {
        const tempDir = `${testDir}/temp`;

        createDir(tempDir);

        expect(fs.existsSync(tempDir)).toBe(true);

        fs.rmdirSync(tempDir);
    });
});

describe('deleteFile function', () => {
    it('should delete file', () => {
        fs.writeFileSync(`${playgroundDir}/file1.txt`, 'file1');

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBe(true);

        deleteFile(`${playgroundDir}/file1.txt`);

        expect(fs.existsSync(`${playgroundDir}/file1.txt`)).toBe(false);
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
