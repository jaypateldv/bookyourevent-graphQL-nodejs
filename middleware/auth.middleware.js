const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token || token === '') {
            req.isAuth = false;
            return next();
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        req.authUser = decodedToken.userId;
        req.isAuth = true;
        next();
    } catch (error) {
        console.error(error);
        next();
    }
};