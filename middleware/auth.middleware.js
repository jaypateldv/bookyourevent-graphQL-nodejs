const jwt = require('jsonwebtoken');
const CustomError = require('../helpers/customError');
const user = require('../models/user');
module.exports = async ({req, res}) => {
    try {
        console.log("=== Middleware started:", new Date().toLocaleString()),req;
        // if (req.body.operationName == 'login' || req.body.operationName == 'createUser')
        //     return true;
        const token = req.headers['authorization'];
        if (!token || token === '') {
            req.isAuth = false;
            console.log("=== User unauthorized 1");
            throw new CustomError('Unauthorised User', 401);
            // return next();
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        const loggedUSer = await user.findById(decodedToken.userId);
        if (loggedUSer) {
            req.authUser = decodedToken.userId;
            req.isAuth = true;
            console.log("=== User authorized");
            return { loggedUSer, req };
            // next();
        } else {
            this.isAuth = false;
            console.log("=== User unauthorized 2");
            throw new CustomError('Unauthorised User', 401);
            // next();
        }
    } catch (error) {
        console.error(error);
        console.log("=== User unauthorized");
        throw error;
        // next();
    }
};