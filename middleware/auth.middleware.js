const jwt = require('jsonwebtoken');
const user = require('../models/user');
module.exports = async ({ req, res, a }) => {
    try {
        console.log("=== Middleware started:", new Date().toLocaleString(), req.headers['authorization']);
        const token = req.headers['authorization'];
        if (!token || token === '') {
            req.isAuth = false;
            console.log("=== User unauthorized 1");
            return { req };
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        const loggedUSer = await user.findById(decodedToken.userId);
        if (loggedUSer) {
            req.authUser = decodedToken.userId;
            req.isAuth = true;
            console.log("=== User authorized");
            return { loggedUSer, req };
        } else {
            this.isAuth = false;
            console.log("=== User unauthorized 2");
            return { req };
        }
    } catch (error) {
        console.error(error);
        console.log("=== User unauthorized");
        req.isAuth = false;
        return { req };
    }
};