const fs = require('fs');
const path = require('path');
const { rootDir } = require('../../utils/constant');
const { addData, getData, removeData, isDataExist } = require('../../utils/data');

test('json file exists', () => {
    const jsonPath = path.join(rootDir, 'tests', 'data.json');

    expect(isDataExist('test.pdf', jsonPath)).toBe(false);

    addData(
        'test.pdf',
        {
            checksum: 'test',
            publicKey: 'test'
        },
        jsonPath
    );

    const data = getData('test.pdf', jsonPath);

    expect(isDataExist('test.pdf', jsonPath)).toBe(true);
    expect(data).toEqual({
        checksum: 'test',
        publicKey: 'test'
    });

    removeData('test.pdf', jsonPath);

    expect(isDataExist('test.pdf', jsonPath)).toBe(false);
});

test('json file does not exist', () => {
    const jsonPath = path.join(rootDir, 'tests', 'data2.json');

    expect(isDataExist('test.pdf', jsonPath)).toBe(false);

    addData(
        'test.pdf',
        {
            checksum: 'test',
            publicKey: 'test'
        },
        jsonPath
    );

    const data = getData('test.pdf', jsonPath);

    expect(isDataExist('test.pdf', jsonPath)).toBe(true);
    expect(data).toEqual({
        checksum: 'test',
        publicKey: 'test'
    });

    removeData('test.pdf', jsonPath);

    expect(isDataExist('test.pdf', jsonPath)).toBe(false);

    fs.unlinkSync(jsonPath);
});
