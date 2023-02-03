/**
 * Convert a value from one format to another
 * @param {string|number} value
 * @param {'dec'|'hex'|'bin'|'text'} from
 * @param {'dec'|'hex'|'bin'|'text'} to
 * @returns
 */
const converter = (value, from, to) => {
    let result = value;

    if (from === 'hex') {
        if (to === 'bin') {
            result = hexToBin(value);
        } else if (to === 'dec') {
            result = hexToDec(value);
        } else if (to === 'text') {
            result = hexToText(value);
        }
    } else if (from === 'bin') {
        if (to === 'hex') {
            result = binToHex(value);
        }
    } else if (from === 'dec') {
        if (to === 'hex') {
            result = decToHex(value);
        } else if (to === 'bin') {
            result = decToBin(value);
        } else if (to === 'text') {
            result = decToText(value);
        }
    } else if (from === 'text') {
        if (to === 'dec') {
            result = textToDec(value);
        }
    }

    return result;
};

/**
 * Pad a string with 0s
 * @param {string} str
 * @param {number} length
 * @returns
 */
const padStart = (str, length = 0) => {
    return str.padStart(length, '0');
};

/**
 * Convert a number to binary
 * @param {number} num
 * @param {number} length
 * @returns
 */
const toBinary = (num, length = 8) => {
    return padStart(num.toString(2), length);
};

/**
 *  Convert a decimal number to binary string
 * @param {number} num
 * @returns
 */
const decToBin = num => {
    return toBinary(num);
};

/**
 * Convert a hex string to binary string
 * @param {string} hex
 * @returns
 */
const hexToBin = hex => {
    return toBinary(parseInt(hex, 16));
};

/**
 * Convert a hex string to decimal number
 * @param {string} hex
 * @returns
 */
const hexToDec = hex => {
    return parseInt(hex, 16);
};

/**
 * Convert a number to hex string
 * @param {number} num
 * @param {number} length
 * @returns
 */
const toHex = (num, length = 2) => {
    return padStart(num.toString(16), length);
};

/**
 * Convert a binary string to hex string
 * @param {string} bin
 * @returns
 */
const binToHex = bin => {
    return toHex(parseInt(bin, 2));
};

/**
 * Convert a decimal number to hex string
 * @param {number} num
 * @returns
 */
const decToHex = num => {
    return toHex(num);
};

/**
 * Convert a decimal number to text
 * @param {number} dec
 * @returns
 */
const decToText = dec => {
    return String.fromCharCode(dec);
};

/**
 * Convert a hex string to text
 * @param {string} hex
 * @returns
 */
const hexToText = hex => {
    return decToText(hexToDec(hex));
};

/**
 * Convert a text to decimal number
 * @param {string} text
 * @returns
 */
const textToDec = text => {
    return text.charCodeAt(0);
};

module.exports = {
    converter,
    decToBin,
    hexToBin,
    hexToDec,
    binToHex,
    decToHex,
    decToText,
    hexToText,
    textToDec
};
