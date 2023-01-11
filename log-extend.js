const fs = require('fs');
const { clearDir, createDir } = require('./fs-extend');

const createLog = (log, logDir = 'logs', filename = 'error.log') => {
    createDir(logDir);
    fs.appendFileSync(`${logDir}/${filename}`, `${formatLogDateTime()} - ${log}\n`);
};

const clearLogDir = (logDir = 'logs') => {
    clearDir(logDir);
};

const clearLog = (logDir = 'logs', filename = 'error.log') => {
    fs.unlinkSync(`${logDir}/${filename}`);
    fs.writeFileSync(`${logDir}/${filename}`, '');
};

const formatLogDateTime = () => {
    const now = new Date();
    const day = now.getDate();
    const month = now.toLocaleString('default', { month: 'long' });
    const year = now.getFullYear();
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    const second = now.getSeconds().toString().padStart(2, '0');
    return `[${day} ${month} ${year} ${hour}:${minute}:${second}]`;
};

module.exports = {
    clearLog,
    clearLogDir,
    createLog
};
