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

const padStart = (str, length = 0) => {
    return str.padStart(length, '0');
};

const toBinary = (number, length = 8) => {
    return padStart(number.toString(2), length);
};

const decToBin = number => {
    return toBinary(number);
};

const hexToBin = hex => {
    return toBinary(parseInt(hex, 16));
};

const hexToDec = hex => {
    return parseInt(hex, 16);
};

const toHex = (number, length = 2) => {
    return padStart(number.toString(16), length);
};

const binToHex = bin => {
    return toHex(parseInt(bin, 2));
};

const decToHex = number => {
    return toHex(number);
};

const decToText = dec => {
    return String.fromCharCode(dec);
};

const hexToText = hex => {
    return decToText(hexToDec(hex));
};

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
