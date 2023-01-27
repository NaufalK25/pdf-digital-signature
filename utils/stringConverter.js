const asciiToHex = (str = '') => {
    return str
        .split('')
        .map(char => char.charCodeAt(0).toString(16))
        .join('');
};

const hexToAscii = (hex = '') => {
    if (!hex || hex.length % 2 !== 0) {
        return '';
    }

    return hex
        .match(/.{1,2}/g)
        .map(byte => String.fromCharCode(parseInt(byte, 16)))
        .join('');
};

const bytesToHex = (bytes = []) => {
    return bytes.map(byte => byte.toString(16)).join('');
};

const hexToBytes = (hex = '') => {
    if (!hex || hex.length % 2 !== 0) {
        return [];
    }

    return hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16));
};

const bytesToAscii = (bytes = []) => {
    return bytes.map(byte => String.fromCharCode(byte)).join('');
};

const asciiToBytes = (str = '') => {
    return str.split('').map(char => char.charCodeAt(0));
};

module.exports = {
    asciiToHex,
    hexToAscii,
    bytesToHex,
    hexToBytes,
    bytesToAscii,
    asciiToBytes
};
