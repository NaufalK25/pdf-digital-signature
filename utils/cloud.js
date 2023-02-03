require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');

/**
 * Dropbox client
 */
const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

/**
 * Get all pdf files from Dropbox
 * @returns
 */
const getFilesFromCloud = async () => {
    try {
        const response = await dbx.filesListFolder({ path: '' });
        const result = response.result.entries;
        const pdfs = [];

        for (const { name, path_lower } of result) {
            if (!name.endsWith('.pdf')) {
                continue;
            }

            const sharedLinkRes = await dbx.sharingCreateSharedLinkWithSettings({ path: path_lower });

            pdfs.push({
                success: true,
                name,
                url: sharedLinkRes.result.url
            });
        }
        return pdfs;
    } catch (err) {
        return [
            {
                success: false,
                name: '',
                url: ''
            }
        ];
    }
};

/**
 * Upload file to Dropbox
 * @param {string} filePath
 * @param {string} filename
 * @returns
 */
const uploadToCloud = async (filePath, filename) => {
    const file = fs.readFileSync(filePath);
    const result = {
        success: true,
        name: filename,
        url: ''
    };

    try {
        const response = await dbx.filesUpload({ path: `/${filename}`, contents: file });

        if (response.result) {
            const sharedLinkRes = await dbx.sharingCreateSharedLinkWithSettings({ path: response.result.path_lower });
            result.url = sharedLinkRes.result.url;
        }
    } catch (err) {
        result.success = false;
    }

    return result;
};

/**
 * Delete file from Dropbox
 * @param {string} filePath
 * @returns
 */
const deleteFromCloud = async filePath => {
    const filename = path.basename(filePath);
    const result = {
        success: true,
        name: filename,
        url: ''
    };

    try {
        const response = await dbx.filesDeleteV2({ path: `/${filename}` });

        if (response.result) {
            const sharedLinkRes = await dbx.sharingCreateSharedLinkWithSettings({ path: response.result.path_lower });
            result.url = sharedLinkRes.result.url;
        }
    } catch (err) {
        result.success = false;
    }

    return result;
};

module.exports = {
    getFilesFromCloud,
    uploadToCloud,
    deleteFromCloud
};
