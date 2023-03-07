const { validationResult } = require('express-validator');
const BLAKE2s = require('../../utils/BLAKE2s');
const { getLogin, getRegister, postLogin, postLogout, postRegister } = require('../../controllers/auth');
const { User } = require('../../database/models');

const mockRequest = ({ user, body } = {}) => ({
    login: jest.fn(),
    logout: jest.fn(),
    flash: jest.fn(),
    user,
    body
});
const mockResponse = () => {
    const res = {};
    res.render = jest.fn().mockReturnValue(res);
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

jest.mock('express-validator');

describe('getRegister controller', () => {
    test('with user', () => {
        const req = mockRequest({
            user: {
                name: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();

        getRegister(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Register | PDF Digital Signature',
            activeNav: 'register',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });

    test('no user', () => {
        const req = mockRequest();
        const res = mockResponse();

        getRegister(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Register | PDF Digital Signature',
            activeNav: 'register',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });
});

describe('getLogin controller', () => {
    test('with user', () => {
        const req = mockRequest({
            user: {
                name: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();

        getLogin(req, res);

        expect(res.render).toHaveBeenCalledWith('login', {
            title: 'Login | PDF Digital Signature',
            activeNav: 'login',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });

    test('no user', () => {
        const req = mockRequest();
        const res = mockResponse();

        getLogin(req, res);

        expect(res.render).toHaveBeenCalledWith('login', {
            title: 'Login | PDF Digital Signature',
            activeNav: 'login',
            loggedInUser: req.user || null,
            flash: {
                type: req.flash('type') || '',
                message: req.flash('message') || ''
            }
        });
    });
});

describe('postRegister controller', () => {
    beforeAll(() => {
        jest.spyOn(User, 'create').mockResolvedValue({});
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test('success', async () => {
        validationResult.mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([])
        });
        jest.spyOn(BLAKE2s.prototype, 'hexDigest').mockReturnValue('test');

        const req = mockRequest({
            body: {
                username: 'test',
                password: 'test',
                confirmPassword: 'test'
            }
        });
        const res = mockResponse();

        await postRegister(req, res);

        expect(User.create).toHaveBeenCalledWith({
            username: req.body.username,
            password: 'test'
        });
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'You have been registered successfully');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('validation error', async () => {
        validationResult.mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(false),
            array: jest.fn().mockReturnValue([{ msg: 'test' }])
        });

        const req = mockRequest({
            body: {
                username: '',
                password: 'test',
                confirmPassword: 'test'
            }
        });
        const res = mockResponse();

        await postRegister(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'test');
        expect(res.redirect).toHaveBeenCalledWith('/register');
    });

    test('password does not match', async () => {
        validationResult.mockReturnValue({
            isEmpty: jest.fn().mockReturnValue(true),
            array: jest.fn().mockReturnValue([])
        });

        const req = mockRequest({
            body: {
                username: 'test',
                password: 'test',
                confirmPassword: 'test1'
            }
        });
        const res = mockResponse();

        await postRegister(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Password does not match');
        expect(res.redirect).toHaveBeenCalledWith('/register');
    });
});

describe('postLogout', () => {
    test('success', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = null;

        req.logout.mockImplementationOnce(callback => callback(error));

        postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'You have been logged out successfully');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('error', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = new Error('An error occurred');

        req.logout.mockImplementationOnce(callback => callback(error));

        postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Something went wrong');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});
