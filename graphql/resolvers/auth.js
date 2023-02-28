const User = require("../../models/user");
const jwt = require('jsonwebtoken');
const { events } = require("./merge");


module.exports = {

    users: async () => {
        try {
            const users = await User.find({});//.populate('createdEvents');
            return users.map(user => { return { ...user._doc, password: null, createdEvents: events.bind(this, user.createdEvents) }; });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createUser: async (args) => {
        try {
            const existUser = await User.findOne({ email: args.userInput.email });
            if (existUser) throw new Error("Email already exist");
            const user = new User({
                email: args.userInput.email,
                password: args.userInput.password
            });
            const userData = await user.save();
            return { ...userData._doc, password: null };

        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    login: async ({ email, password }) => {
        try {
            const user = await User.findUserByCredential(email, password);
            const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRETE, { expiresIn: "1h" });
            return {
                token,
                ...user._doc,
                createdEvents: events.bind(this, user.createdEvents),
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

};