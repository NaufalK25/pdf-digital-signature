const { alreadyLoggedIn, notLoggedIn } = require('../../middlewares/authMiddleware');

const mockRequest = ({ user } = {}) => ({ user });
const mockResponse = () => {
    const res = {};
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

describe('alreadyLoggedIn middleware', () => {
    test('should redirect to / if user is already logged in', () => {
        const req = mockRequest({
            user: {
                username: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();

        alreadyLoggedIn(req, res, jest.fn());

        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('should call next if user is not logged in', () => {
        const req = mockRequest({
            user: null
        });
        const res = mockResponse();
        const next = jest.fn();

        alreadyLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

describe('notLoggedIn middleware', () => {
    test('should redirect to /login if user is not logged in', () => {
        const req = mockRequest({
            user: null
        });
        const res = mockResponse();

        notLoggedIn(req, res, jest.fn());

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('should call next if user is already logged in', () => {
        const req = mockRequest({
            user: {
                username: 'test',
                password: 'test'
            }
        });
        const res = mockResponse();
        const next = jest.fn();

        notLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
