const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");


module.exports = {

    events: async (parent, args, contextValue, info) => {
        try {
            console.log("== Events started");
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) {
                const error = new Error('Unauthorized user');
                error.extensions = { code: 'UNAUTHORIZED' };
                throw error;
            }
            let filterObject = {};
            for (let key in args) {
                filterObject[key] = args[key];
            }
            const events = await Event.find({ ...filterObject, creator: req.authUser });
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    allEvents: async (parent, args, contextValue, info) => {
        try {
            console.log("== AllEvents started");
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) {
                const error = new Error('Unauthorized user');
                error.extensions = { code: 'UNAUTHORIZED' };
                throw error;
            }
            let filterObject = {};
            for (let key in args) {
                filterObject[key] = args[key];
            }
            const events = await Event.find({ ...filterObject }).sort({ createdAt: 1 });
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createEvent: async (parent, args, contextValue, info) => {
        try {
            console.log("== CreateEvent started");
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) throw new Error("Unauthorized user");
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.authUser
            });

            const existUser = await User.findByIdAndUpdate(req.authUser, { $push: { createdEvents: event._id } });
            if (!existUser) throw new Error("User not found");
            const savedEvent = await event.save();//.populate('creator');

            return transformEvent(savedEvent);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};