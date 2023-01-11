const PDF = require('./PDF');

const encrypt = () => {
    const normalPdf = new PDF('data/example-1.pdf');
    normalPdf.encrypt('data/encrypt/encrypted.pdf');
};

const decrypt = async () => {
    const encryptedPdf = new PDF('data/encrypt/encrypted.pdf', true);
    encryptedPdf.decrypt('data/decrypt/decrypted.pdf');
};

encrypt();
decrypt();
