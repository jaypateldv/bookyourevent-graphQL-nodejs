const { default: mongoose } = require("mongoose");
const CustomError = require("../../helpers/customError");
const { getPaginationParams } = require("../../helpers/utils");
const booking = require("../../models/booking");
const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");


module.exports = {

    events: async (parent, args, contextValue, info) => {
        try {
            console.log("== Events started");
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) {
                throw new CustomError('Unauthorized User', 401);
            }
            const { limit, skip, sortBy, sortOrder } = getPaginationParams(args);
            let filterObject = {};
            const events = await Event.find({ ...filterObject, creator: loggedUser._id }).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit);
            const totalDocuments = await Event.countDocuments({ ...filterObject, creator: loggedUser._id });
            return {
                events: events.map(event => {
                    return transformEvent(event);
                }),
                total: totalDocuments
            };
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    deleteEvent: async (parent, args, contextValue, info) => {
        try {
            console.log("== deleteEvent", args);
            const { loggedUser, req } = contextValue;
            if (!req.isAuth)
                throw new CustomError('Unauthorized User', 401);
            if (!args.eventId || !mongoose.isValidObjectId(args.eventId))
                throw new CustomError('Required Valid Event Id', 400);
            const deletedEvent = await Event.findOneAndDelete({ _id: args.eventId, creator: loggedUser._id });
            await booking.deleteMany({ event: deletedEvent });
            console.log("deletedEvent", deletedEvent);
            if (deletedEvent)
                return {
                    message: "Event deleted successfully."
                };
            else {
                throw new CustomError('Event not found', 400);
            }
        } catch (error) {
            console.error("## Error", error);
            throw error;
        }
    },

    allEvents: async (parent, args, contextValue, info) => {
        try {
            console.log("== AllEvents started");
            const { loggedUser, req } = contextValue;
            if (!req.isAuth) {
                throw new CustomError("Unauthorised user", 401);
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
            if (!req.isAuth) throw new CustomError("Unauthorized user", 401);
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: req.authUser
            });

            const existUser = await User.findByIdAndUpdate(req.authUser, { $push: { createdEvents: event._id } });
            if (!existUser) throw new CustomError("User not found", 400);
            const savedEvent = await event.save();//.populate('creator');

            return transformEvent(savedEvent);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};