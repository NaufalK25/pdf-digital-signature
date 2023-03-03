const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BLAKE2s = require('../utils/BLAKE2s');
const { User } = require('../database/models');
const { textToDec } = require('../utils/converter');

passport.use(
    new LocalStrategy(
        {
            usernameField: 'username',
            passwordField: 'password'
        },
        async (username, password, done) => {
            try {
                const user = await User.findByUsername(username);
                if (!user) return done(null, false, { param: 'username', message: 'Username or Password is incorrect' });

                const passwordBuffer = Buffer.from(password);
                const publicKey = username.padEnd(32, ' ');
                const keyBuffer = new Uint8Array([...publicKey].map(textToDec));
                const hashedPassword = new BLAKE2s(publicKey.length, keyBuffer).update(passwordBuffer).hexDigest();
                const checkPassword = hashedPassword === user.password;

                if (!checkPassword) return done(null, false, { param: 'password', message: 'Username or Password is incorrect' });
                return done(null, user, { message: 'Logged in Successfully' });
            } catch (err) {
                return done(err, false, { param: 'error', message: 'Error while trying to log in' });
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser(async (userId, done) => {
    try {
        const user = await User.findByPk(userId);
        if (user) return done(null, user);
        return done(null, false);
    } catch (err) {
        return done(err, false);
    }
});

module.exports = passport;
