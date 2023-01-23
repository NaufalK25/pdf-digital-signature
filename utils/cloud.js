require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Dropbox } = require('dropbox');

const dbx = new Dropbox({ accessToken: process.env.DROPBOX_ACCESS_TOKEN });

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
                name,
                url: sharedLinkRes.result.url
            });
        }
        return pdfs;
    } catch (error) {
        return [];
    }
};

const uploadToCloud = async (filePath, filename) => {
    const file = fs.readFileSync(filePath);

    try {
        await dbx.filesUpload({ path: `/${filename}`, contents: file });
    } catch (error) {
        console.error(error);
    }
};

const deleteFromCloud = async filePath => {
    const filename = path.basename(filePath);

    try {
        await dbx.filesDeleteV2({ path: `/${filename}` });
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    getFilesFromCloud,
    uploadToCloud,
    deleteFromCloud
};
