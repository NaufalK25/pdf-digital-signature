const asciiToHex = (str = '') => {
    let hex = '';
    for (const char of str) {
        hex += char.charCodeAt(0).toString(16);
    }

    return hex;
};

const hexToAscii = (hex = '') => {
    let ascii = '';
    for (let i = 0; i < hex.length; i += 2) {
        ascii += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }

    return ascii;
};

const bytesToHex = (bytes = []) => {
    let hex = '';
    for (const byte of bytes) {
        hex += byte.toString(16);
    }

    return hex;
};

const hexToBytes = (hex = '') => {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substr(i, 2), 16));
    }

    return bytes;
};

const bytesToAscii = (bytes = []) => {
    let ascii = '';
    for (const byte of bytes) {
        ascii += String.fromCharCode(byte);
    }

    return ascii;
};

const asciiToBytes = (str = '') => {
    const bytes = [];
    for (const char of str) {
        bytes.push(char.charCodeAt(0));
    }

    return bytes;
};

module.exports = {
    asciiToHex,
    hexToAscii,
    bytesToHex,
    hexToBytes,
    bytesToAscii,
    asciiToBytes
};
