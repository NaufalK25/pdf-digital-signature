const fs = require('fs');
const path = require('path');
const { rootDir } = require('../../utils/constant');
const { addData, getData, isDataExist, removeData } = require('../../utils/data');

test('json file exists', () => {
    const jsonPath = path.join(rootDir, 'tests', 'data.json');

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(false);

    addData(
        'test-data.pdf',
        {
            checksum: 'test',
            publicKey: 'test'
        },
        jsonPath
    );

    const data = getData('test-data.pdf', jsonPath);

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(true);
    expect(data).toEqual({
        checksum: 'test',
        publicKey: 'test'
    });

    removeData('test-data.pdf', jsonPath);

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(false);
});

test('json file does not exist', () => {
    const jsonPath = path.join(rootDir, 'tests', 'data2.json');

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(false);

    addData(
        'test-data.pdf',
        {
            checksum: 'test',
            publicKey: 'test'
        },
        jsonPath
    );

    const data = getData('test-data.pdf', jsonPath);

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(true);
    expect(data).toEqual({
        checksum: 'test',
        publicKey: 'test'
    });

    removeData('test-data.pdf', jsonPath);

    expect(isDataExist('test-data.pdf', jsonPath)).toBe(false);

    fs.unlinkSync(jsonPath);
});
