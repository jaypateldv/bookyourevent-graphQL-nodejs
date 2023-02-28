const jwt = require('jsonwebtoken');
module.exports = async (req, res, next) => {
    try {
        const token = req.get('Authorization');
        if (!token || token === '') {
            req.isAuth = false;
            return next();
            // throw new Error("");
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRETE);
        req.authUser = decodedToken.userId;
        req.isAuth = true;
        console.log("decode", decodedToken);
        next();
    } catch (error) {
        console.error(error);
        // throw new Error("Unauthorized user");
        next();
    }
};