const fs = require('fs');
const path = require('path');
const AES = require('./utils/AES');
const BLAKE2s = require('./utils/BLAKE2s');
const { textToDec } = require('./utils/converter');
require('dotenv').config();

const getSignature = filename => {
    const fileBuffer = fs.readFileSync(path.join(__dirname, 'data', filename));
    const publicKey = '1234'.padEnd(32, ' ');
    const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
    return new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();
};

const getEncryptedSignature = signature => {
    const privateKey = 'kunciprivataesku';
    const encryptedSignature = new AES(privateKey).encrypt(signature);
    return encryptedSignature;
};

const getDecryptedSignature = encryptedSignature => {
    const privateKey = 'kunciprivataesku';
    const decryptedSignature = new AES(privateKey).decrypt(encryptedSignature);
    return decryptedSignature;
};

const textToHex = text => {
    return [...text].map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
};

const signature = getSignature('a80.pdf');
const encryptedSignature = getEncryptedSignature(signature);
const decryptedSignature = getDecryptedSignature(encryptedSignature);

console.log('signature', '\n', signature, '\n');
console.log('encrypted signature', '\n', textToHex(encryptedSignature), '\n');
console.log('decrypted signature', '\n', decryptedSignature, '\n');
