const passport = require('passport');
const { validationResult } = require('express-validator');
const { getLogin, getRegister, postLogin, postLogout, postRegister } = require('../../controllers/auth');
const BLAKE2s = require('../../utils/BLAKE2s');
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

jest.mock('passport');
jest.mock('express-validator');

describe('getRegister controller', () => {
    test('should render the register page', () => {
        const req = mockRequest();
        const res = mockResponse();

        getRegister(req, res);

        expect(res.render).toHaveBeenCalledWith('register', {
            title: 'Daftar | PDF Digital Signature',
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

        getLogin(req, res);

        expect(res.render).toHaveBeenCalledWith('login', {
            title: 'Masuk | PDF Digital Signature',
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

        await postRegister(req, res);

        expect(User.create).toHaveBeenCalledWith({
            username: req.body.username,
            password: 'test'
        });
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'Akun anda berhasil terdaftar');
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

        await postRegister(req, res);

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

        await postRegister(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Password tidak cocok');
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

        postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Terjadi kesalahan');
        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    describe('user not found', () => {
        test('should redirect to /login and give flash error message if user not found (error message available)', () => {
            passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
                callback(null, false, { param: 'username', message: 'Username atau password salah' });
            });

            postLogin(req, res);

            expect(req.flash).toHaveBeenCalledWith('type', 'danger');
            expect(req.flash).toHaveBeenCalledWith('message', 'Username atau password salah');
            expect(res.redirect).toHaveBeenCalledWith('/login');
        });

        test('should redirect to /login and give flash error message if user not found (error message unavailable)', () => {
            passport.authenticate.mockImplementationOnce((strategy, callback) => (req, res) => {
                callback(null, false, {});
            });

            postLogin(req, res);

            expect(req.flash).toHaveBeenCalledWith('type', 'danger');
            expect(req.flash).toHaveBeenCalledWith('message', 'Terjadi kesalahan');
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
                { message: 'Anda berhasil masuk' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => {
            callback(new Error('Login error'));
        });

        postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Terjadi kesalahan');
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
                { message: 'Anda berhasil masuk' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => callback(null));
        validationResult.mockReturnValueOnce({
            isEmpty: jest.fn(() => false),
            array: jest.fn(() => [{ msg: 'Validation error' }])
        });

        postLogin(req, res);

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
                { message: 'Anda berhasil masuk' }
            );
        });
        req.login.mockImplementationOnce((user, callback) => callback(null));
        validationResult.mockReturnValueOnce({
            isEmpty: jest.fn(() => true),
            array: jest.fn(() => [])
        });

        postLogin(req, res);

        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'Anda berhasil masuk');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});

describe('postLogout controller', () => {
    test('should logout the user', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = null;

        req.logout.mockImplementationOnce(callback => callback(error));

        postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'success');
        expect(req.flash).toHaveBeenCalledWith('message', 'Anda berhasil keluar');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('should redirect to / and give flash error message if error occurs', () => {
        const req = mockRequest();
        const res = mockResponse();
        const error = new Error('Terjadi kesalahan');

        req.logout.mockImplementationOnce(callback => callback(error));

        postLogout(req, res);

        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith('type', 'danger');
        expect(req.flash).toHaveBeenCalledWith('message', 'Terjadi kesalahan');
        expect(res.redirect).toHaveBeenCalledWith('/');
    });
});
