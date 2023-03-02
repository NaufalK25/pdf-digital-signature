const alreadyLoggedIn = (req, res, next) => {
    if (req.user) {
        return res.redirect('/');
    }
    next();
};

const notLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }
    next();
};

module.exports = {
    alreadyLoggedIn,
    notLoggedIn
};
