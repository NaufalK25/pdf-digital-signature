const fs = require('fs');
const path = require('path');
const { rootDir } = require('./constant');

const defaultJSONPath = path.join(rootDir, 'data', 'data.json');

const getJSONContent = (jsonPath = defaultJSONPath) => {
    if (!fs.existsSync(jsonPath)) {
        fs.writeFileSync(jsonPath, '{}');
    }

    let jsonContent = fs.readFileSync(jsonPath, 'utf8');
    jsonContent = JSON.parse(jsonContent);

    return jsonContent;
};

const addData = (filename, data, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);

    jsonContent[filename] = data;

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

const getData = (filename, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);
    return jsonContent[filename];
};

const removeData = (filename, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);

    delete jsonContent[filename];

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

const isDataExist = (filename, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);
    return !!jsonContent[filename];
};

module.exports = {
    addData,
    getData,
    removeData,
    isDataExist
};
