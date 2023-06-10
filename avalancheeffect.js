const fs = require('fs');
const path = require('path');
const AES = require('./utils/AES');
const BLAKE2s = require('./utils/BLAKE2s');
const { textToDec } = require('./utils/converter');
require('dotenv').config();

const getSignature = filename => {
    const fileBuffer = fs.readFileSync(path.join(__dirname, 'data', filename));
    const publicKey = 'test'.padEnd(32, ' ');
    const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
    return new BLAKE2s(publicKey.length, keyBuffer).update(fileBuffer).hexDigest();
};

const getEncryptedSignature = signature => {
    const privateKey = process.env.AES_KEY;
    const encryptedSignature = new AES(privateKey).encrypt(signature);
    return textToHex(encryptedSignature);
};

const textToHex = text => {
    return [...text].map(char => char.charCodeAt(0).toString(16).padStart(2, '0')).join('');
};

const countAvalancheEffect = (value1, value2) => {
    if (value1.length !== value2.length) throw new Error('Panjang kedua nilai harus sama');

    let count = 0;
    for (let i = 0; i < value1.length; i++) {
        if (value1[i] !== value2[i]) {
            count++;
        }
    }

    return (count / value1.length) * 100;
};

const value1 = getSignature('10.pdf');
const value2 = getSignature('11.pdf');
console.log(value1);
console.log(value2);
console.log(countAvalancheEffect(value1, value2));

const value3 = getEncryptedSignature(value1);
const value4 = getEncryptedSignature(value2);
console.log(value3);
console.log(value4);
console.log(countAvalancheEffect(value3, value4));
