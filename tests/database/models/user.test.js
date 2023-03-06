const { User } = require('../../../database/models');

const mockUser = {
    username: 'test',
    password: 'test'
};

beforeAll(() => {
    User.findOne = jest.fn().mockReturnValue(mockUser);
});

test('Find user by username', async () => {
    const user = await User.findByUsername(mockUser.username);

    expect(user).toEqual(mockUser);
});

test('Generate private key', async () => {
    expect(await User.generatePrivateKey(mockUser.username)).toBe(mockUser.password.substring(0, 16));
});
