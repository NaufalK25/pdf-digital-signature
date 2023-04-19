const passport = require('passport');
const { validationResult } = require('express-validator');
const AuthController = require('../../controllers/auth');
const BLAKE2s = require('../../utils/BLAKE2s');
const { User } = require('../../database/models');

const authController = new AuthController();
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

jest.mock('passport');
jest.mock('express-validator');

describe('getRegister controller', () => {
    test('should render the register page', () => {
        const req = mockRequest();
        const res = mockResponse();

        authController.getRegister(req, res);

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
    test('should render the login page', () => {
        const req = mockRequest();
        const res = mockResponse();

        authController.getLogin(req, res);

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

    test('should register the new user', async () => {
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

        await authController.postRegister(req, res);

        expect(User.create).toHaveBeenCalledWith({
            username: req.body.username,
            password: 'test'
        });
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'You have been registered successfully');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('should redirect to /login and give flash error message if validation fails', async () => {
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

        await authController.postRegister(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'test');
        expect(res.redirect).toHaveBeenCalledWith('/register');
    });

    test('should redirect to /login and give flash error message if password does not match', async () => {
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

        await authController.postRegister(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Password does not match');
        expect(res.redirect).toHaveBeenCalledWith('/register');
    });
});

describe('postLogin', () => {
    let req, res;

    beforeAll(() => {
        req = mockRequest();
        res = mockResponse();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should redirect to /login and give flash error message if pasport authentication error', () => {
        passport.authenticate = jest.fn().mockImplementationOnce((strategy, callback) => (req, res) => {
            callback(new Error('Authentication error'));
        });

        authController.postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Something went wrong');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    describe('user not found', () => {
        test('should redirect to /login and give flash error message if user not found (error message available)', () => {
            passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
                callback(null, false, { param: 'username', message: 'Username or Password is incorrect' });
            });

            authController.postLogin(req, res);

            expect(req.flash).toHaveBeenCalledWith('type', 'danger');
            expect(req.flash).toHaveBeenCalledWith('message', 'Username or Password is incorrect');
            expect(res.redirect).toHaveBeenCalledWith('/login');
        });

        test('should redirect to /login and give flash error message if user not found (error message unavailable)', () => {
            passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
                callback(null, false, {});
            });

            authController.postLogin(req, res);

            expect(req.flash).toHaveBeenCalledWith('type', 'danger');
            expect(req.flash).toHaveBeenCalledWith('message', 'Something went wrong');
            expect(res.redirect).toHaveBeenCalledWith('/login');
        });
    });

    test('should redirect to /login and give flash error message if login error', () => {
        passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
            callback(
                null,
                {
                    id: 1,
                    username: 'test',
                    password: 'test'
                },
                { message: 'Logged in Successfully' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => {
            callback(new Error('Login error'));
        });

        authController.postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Something went wrong');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('should redirect to /login if validation fails', () => {
        passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
            callback(
                null,
                {
                    id: 1,
                    username: 'test',
                    password: 'test'
                },
                { message: 'Logged in Successfully' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => callback(null));
        validationResult.mockReturnValueOnce({
            isEmpty: jest.fn(() => false),
            array: jest.fn(() => [{ msg: 'Validation error' }])
        });

        authController.postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Validation error');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('should login the user', () => {
        passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
            callback(
                null,
                {
                    id: 1,
                    username: 'test',
                    password: 'test'
                },
                { message: 'Logged in Successfully' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => callback(null));
        validationResult.mockReturnValueOnce({
            isEmpty: jest.fn(() => true),
            array: jest.fn(() => [])
        });

        authController.postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'You have been logged in successfully');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('postLogout controller', () => {
    test('should logout the user', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = null;

        req.logout.mockImplementationOnce(callback => callback(error));

        authController.postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'You have been logged out successfully');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('should redirect to / and give flash error message if error occurs', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = new Error('An error occurred');

        req.logout.mockImplementationOnce(callback => callback(error));

        authController.postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Something went wrong');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});
