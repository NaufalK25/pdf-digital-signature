jest.mock('fs');
const fs = require('fs');
const path = require('path');
const { clearDir, createDir } = require('../../utils/file');

describe('createDir function', () => {
    beforeAll(() => {
        fs.mkdirSync = jest.fn();
    });

    it('should create the directory if it does not exist', () => {
        fs.existsSync = jest.fn().mockReturnValue(false);

        const dirPath = path.join(__dirname, 'mock-dir');
        createDir(dirPath);

        fs.existsSync = jest.fn().mockReturnValue(true);

        expect(fs.existsSync(dirPath)).toBe(true);
    });

    it('should not create the directory if it already exists', () => {
        fs.existsSync = jest.fn().mockReturnValue(true);

        const dirPath = path.join(__dirname, 'mock-dir');
        expect(fs.existsSync(dirPath)).toBe(true);

        createDir(dirPath);

        expect(fs.mkdirSync).not.toHaveBeenCalled();
    });
});

describe('clearDir function', () => {
    let dirPath = '';

    beforeAll(() => {
        dirPath = path.join(__dirname, 'mock-dir');

        fs.unlinkSync = jest.fn();
    });

    it('should remove all files from the directory', () => {
        fs.readdirSync = jest.fn().mockReturnValue(['mock.txt', 'mock2.txt']);

        clearDir(dirPath);

        expect(fs.readdirSync).toHaveBeenCalledWith(dirPath);

        fs.readdirSync = jest.fn().mockReturnValue([]);

        expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(dirPath, 'mock.txt'));
        expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(dirPath, 'mock2.txt'));
        expect(fs.readdirSync(dirPath)).toEqual([]);
    });

    it('should not remove files that are in the except array', () => {
        fs.readdirSync = jest.fn().mockReturnValue(['mock.txt', 'mock2.txt']);

        clearDir(dirPath, ['mock2.txt']);

        expect(fs.readdirSync).toHaveBeenCalledWith(dirPath);

        fs.readdirSync = jest.fn().mockReturnValue(['mock.txt']);

        expect(fs.unlinkSync).toHaveBeenCalledWith(path.join(dirPath, 'mock.txt'));
        expect(fs.unlinkSync).not.toHaveBeenCalledWith(path.join(dirPath, 'mock2.txt'));
        expect(fs.readdirSync(dirPath)).toEqual(['mock.txt']);
    });
});
