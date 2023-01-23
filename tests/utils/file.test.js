const fs = require('fs');
const path = require('path');
const { clearDir, createDir, deleteFile, getDirFromPath, getFilenameFromPath, splitDirAndFilename } = require('../../utils/file');

const testDir = path.join(__dirname, '..');
const uploadsDir = path.join(testDir, 'uploads');

afterAll(() => {
    if (!fs.existsSync(path.join(uploadsDir, '.gitkeep'))) {
        fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');
    }

    clearDir(uploadsDir, ['.gitkeep']);
});

describe('clearDir function', () => {
    beforeEach(() => {
        fs.writeFileSync(path.join(uploadsDir, 'file1.txt'), 'file1');
        fs.writeFileSync(path.join(uploadsDir, 'file2.txt'), 'file2');
    });

    afterEach(() => {
        expect(fs.existsSync(path.join(uploadsDir, 'file1.txt'))).toBeFalsy();
        expect(fs.existsSync(path.join(uploadsDir, 'file2.txt'))).toBeFalsy();
    });

    it('should clear directory', () => {
        expect(fs.existsSync(path.join(uploadsDir, 'file1.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(uploadsDir, 'file2.txt'))).toBeTruthy();

        clearDir(uploadsDir);
    });

    it('should clear directory except specific file(s)', () => {
        fs.writeFileSync(path.join(uploadsDir, '.gitkeep'), '');

        expect(fs.existsSync(path.join(uploadsDir, 'file1.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(uploadsDir, 'file2.txt'))).toBeTruthy();
        expect(fs.existsSync(path.join(uploadsDir, '.gitkeep'))).toBeTruthy();

        clearDir(uploadsDir, ['.gitkeep']);

        expect(fs.existsSync(path.join(uploadsDir, '.gitkeep'))).toBeTruthy();

        deleteFile(path.join(uploadsDir, '.gitkeep'));
    });
});

describe('createDir function', () => {
    it('should create directory', () => {
        const tempDir = path.join(testDir, 'temp');

        createDir(tempDir);

        expect(fs.existsSync(tempDir)).toBeTruthy();

        fs.rmdirSync(tempDir);
    });
});

describe('deleteFile function', () => {
    it('should delete file', () => {
        fs.writeFileSync(path.join(uploadsDir, 'file1.txt'), 'file1');

        expect(fs.existsSync(path.join(uploadsDir, 'file1.txt'))).toBeTruthy();

        deleteFile(path.join(uploadsDir, 'file1.txt'));

        expect(fs.existsSync(path.join(uploadsDir, 'file1.txt'))).toBeFalsy();
    });
});

describe('getDirFromPath function', () => {
    it('should get directory from path', () => {
        const filePath = path.join(uploadsDir, 'file1.txt');
        const dir = getDirFromPath(filePath);

        expect(dir).toBe(uploadsDir);
    });
});

describe('getFilenameFromPath function', () => {
    it('should get filename from path', () => {
        const filePath = path.join(uploadsDir, 'file1.txt');
        const filename = getFilenameFromPath(filePath);

        expect(filename).toBe('file1.txt');
    });
});

describe('splitDirAndFilename function', () => {
    it('should split directory and filename', () => {
        const filePath = path.join(uploadsDir, 'file1.txt');
        const { dir, base } = splitDirAndFilename(filePath);

        expect(dir).toBe(uploadsDir);
        expect(base).toBe('file1.txt');
    });
});
