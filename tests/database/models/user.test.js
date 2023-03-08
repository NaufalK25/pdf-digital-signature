const { User } = require('../../../database/models');

const userMock = {
    id: 1,
    username: 'test',
    password: 'test'
};

beforeAll(() => {
    jest.spyOn(User, 'findOne').mockResolvedValue(userMock);
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('findByUsername method should find user data by given username', async () => {
    expect(await User.findByUsername(userMock.username)).toEqual(userMock);
});

test('generatePrivateKey method should generate private key by given username', async () => {
    expect(await User.generatePrivateKey(userMock.username)).toBe(userMock.password.substring(0, 16));
});
