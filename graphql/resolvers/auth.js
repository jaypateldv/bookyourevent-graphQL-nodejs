const User = require("../../models/user");
const jwt = require('jsonwebtoken');
const { events } = require("./merge");
const CustomError = require("../../helpers/customError");


module.exports = {

    async users(parent, args, contextValue, info) {
        try {
            console.log("=== Users started", info.path.key);
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) throw new CustomError('Unauthorized User', 401);
            const user = await User.findById(req.authUser).populate('createdEvents');
            return {
                ...user._doc, password: null
            };
        } catch (error) {
            throw error;
        }
    },

    async createUser(args, { userInput }) {
        try {
            console.log("=== Creat user start", userInput);
            const existUser = await User.findOne({ email: userInput.email });
            if (existUser) throw new CustomError('Email already exist', 400);
            const user = new User({
                email: userInput.email,
                password: userInput.password
            });
            const userData = await user.save();
            return { ...userData._doc, password: null };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async login(args, { email, password }) {
        try {
            console.log("=== Login Start");
            const user = await User.findUserByCredential(email, password);
            const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRETE, { expiresIn: "1h" });
            return {
                token,
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents),
            };
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

};