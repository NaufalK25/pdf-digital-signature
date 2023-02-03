const fs = require('fs');
const path = require('path');
const { rootDir } = require('./constant');

const jsonPath = path.join(rootDir, 'data', 'publicKey.json');

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
 * Add a public key to the JSON file
 * @param {string} filename
 * @param {string} publicKey
 */
const addPublicKey = (filename, publicKey) => {
    const jsonContent = getJSONContent();

    jsonContent[filename] = publicKey;

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

/**
 * Get a public key from the JSON file
 * @param {string} filename
 * @returns
 */
const getPublicKey = filename => {
    const jsonContent = getJSONContent();
    console.log(jsonContent[filename]);

    return jsonContent[filename];
};

/**
 * Remove a public key from the JSON file
 * @param {string} filename
 */
const removePublicKey = filename => {
    const jsonContent = getJSONContent();

    delete jsonContent[filename];

    fs.writeFileSync(jsonPath, JSON.stringify(jsonContent));
};

module.exports = {
    addPublicKey,
    getPublicKey,
    removePublicKey
};
