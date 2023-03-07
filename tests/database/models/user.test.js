const { User } = require('../../../database/models');

const mockUser = {
    username: 'test',
    password: 'test'
};

beforeAll(() => {
    jest.spyOn(User, 'findOne').mockResolvedValue(mockUser);
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('Find user by username', async () => {
    const user = await User.findByUsername(mockUser.username);

    expect(user).toEqual(mockUser);
});

test('Generate private key', async () => {
    expect(await User.generatePrivateKey(mockUser.username)).toBe(mockUser.password.substring(0, 16));
});
