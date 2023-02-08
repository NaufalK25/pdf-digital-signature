const fs = require('fs');
const path = require('path');
const { rootDir } = require('./constant');

const defaultJSONPath = path.join(rootDir, 'data', 'data.json');

/**
 * Get JSON file content as object
 * @param {string} jsonPath
 * @returns
 */
const getJSONContent = (jsonPath = defaultJSONPath) => {
    if (!fs.existsSync(jsonPath)) {
        fs.writeFileSync(jsonPath, '{}');
    }

    let jsonContent = fs.readFileSync(jsonPath, 'utf8');
    jsonContent = JSON.parse(jsonContent);

    return jsonContent;
};

/**
 * Add a data to the JSON file
 * @param {string} filename
 * @param {{ checksum: string, publicKey: string }} data
 * @param {string} jsonPath
 */
const addData = (filename, data, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);

    jsonContent[filename] = data;

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

/**
 * Get data from the JSON file
 * @param {string} filename
 * @returns {{ checksum: string, publicKey: string }}
 */
const getData = (filename, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);
    return jsonContent[filename];
};

/**
 * Remove data from the JSON file
 * @param {string} filename
 * @param {string} jsonPath
 */
const removeData = (filename, jsonPath = defaultJSONPath) => {
    const jsonContent = getJSONContent(jsonPath);

    delete jsonContent[filename];

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

/**
 * Check if data exist in the JSON file
 * @param {string} filename
 * @returns
 */
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
