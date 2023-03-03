const { body } = require('express-validator');
const { User } = require('../database/models');

const registerValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .custom(async value => {
            const user = await User.findByUsername(value);
            if (user) {
                throw new Error('Username already exists');
            }
        }),
    body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirmPassword').notEmpty().withMessage('Confirm password is required').isString().withMessage('Confirm password must be a string')
];

const loginValidator = [
    body('username')
        .trim()
        .notEmpty()
        .withMessage('Username is required')
        .isString()
        .withMessage('Username must be a string')
        .custom(async value => {
            const user = await User.findByUsername(value);
            if (!user) {
                throw new Error('Username or password is incorrect');
            }
        }),
    body('password').notEmpty().withMessage('Password is required').isString().withMessage('Password must be a string').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const publicKeyValidator = [
    body('public_key')
        .notEmpty()
        .withMessage('Public key is required')
        .isString()
        .withMessage('Public key must be a string')
        .isLength({ min: 1, max: 32 })
        .withMessage('Public key must be 1-32 characters long')
];

module.exports = {
    registerValidator,
    loginValidator,
    publicKeyValidator
};
