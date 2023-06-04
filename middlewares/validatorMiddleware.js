const { body } = require('express-validator');
const { User } = require('../database/models');

const registerValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isString()
        .withMessage('Username harurs berupa string')
        .custom(async value => {
            const user = await User.findByUsername(value);
            if (user) {
                throw new Error('Username sudah digunakan');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
        .isString()
        .withMessage('Password harus berurpa string')
        .isLength({ min: 6 })
        .withMessage('Password minimal memiliki 6 karakter'),
    body('confirmPassword').notEmpty().withMessage('Konfirmasi password tidak boleh kosong').isString().withMessage('Konfirmasi password harus berurpa string')
];

const loginValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username tidak boleh kosong')
        .isString()
        .withMessage('Username harus berupa string')
        .custom(async value => {
            const user = await User.findByUsername(value);
            if (!user) {
                throw new Error('Username atau password salah');
            }
        }),
    body('password')
        .notEmpty()
        .withMessage('Password tidak boleh kosong')
        .isString()
        .withMessage('Password harus berupa string')
        .isLength({ min: 6 })
        .withMessage('Password minimal memiliki 6 karakter')
];

const publicKeyValidator = [
    body('public_key')
        .notEmpty()
        .withMessage('Kunci publik tidak boleh kosong')
        .isString()
        .withMessage('Kunci publik harus berupa string')
        .isLength({ min: 1, max: 32 })
        .withMessage('Panjang kunci publik harus 1-32 karakter')
];

module.exports = {
    registerValidator,
    loginValidator,
    publicKeyValidator
};
