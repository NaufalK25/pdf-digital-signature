const fs = require('fs');
const path = require('path');
const { rootDir } = require('./constant');

const jsonPath = path.join(rootDir, 'data', 'data.json');

/**
 * Get JSON file content as object
 * @returns
 */
const getJSONContent = () => {
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
 */
const addData = (filename, data) => {
    const jsonContent = getJSONContent();

    jsonContent[filename] = data;

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

/**
 * Get data from the JSON file
 * @param {string} filename
 * @returns
 */
const getData = filename => {
    const jsonContent = getJSONContent();
    return jsonContent[filename];
};

/**
 * Remove data from the JSON file
 * @param {string} filename
 */
const removeData = filename => {
    const jsonContent = getJSONContent();

    delete jsonContent[filename];

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

/**
 * Check if data exist in the JSON file
 * @param {string} filename
 * @returns
 */
const isDataExist = filename => {
    const jsonContent = getJSONContent();
    return !!jsonContent[filename];
};

module.exports = {
    addData,
    getData,
    removeData,
    isDataExist
};
