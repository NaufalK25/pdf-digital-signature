const { alreadyLoggedIn, notLoggedIn } = require('../../middlewares/authMiddleware');

const userMock = {
    id: 1,
    username: 'test',
    password: 'test'
};

const mockRequest = ({ user } = {}) => ({ user });
const mockResponse = () => {
    const res = {};
    res.redirect = jest.fn().mockReturnValue(res);
    return res;
};

let res, next;

beforeAll(() => {
    res = mockResponse();
    next = jest.fn();
});

describe('alreadyLoggedIn middleware', () => {
    test('should redirect to / if user is already logged in', () => {
        const req = mockRequest({ user: userMock });

        alreadyLoggedIn(req, res, jest.fn());

        expect(res.redirect).toHaveBeenCalledWith('/');
    });

    test('should continue to the next middleware if user is not logged in', () => {
        const req = mockRequest({ user: null });

        alreadyLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});

describe('notLoggedIn middleware', () => {
    test('should redirect to /login if user is not logged in', () => {
        const req = mockRequest({ user: null });

        notLoggedIn(req, res, jest.fn());

        expect(res.redirect).toHaveBeenCalledWith('/login');
    });

    test('should continue to the next middleware if user is logged in', () => {
        const req = mockRequest({ user: userMock });

        notLoggedIn(req, res, next);

        expect(next).toHaveBeenCalled();
    });
});
