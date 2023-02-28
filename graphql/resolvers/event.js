const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");


module.exports = {

    events: async (args, req) => {
        try {
            if (!req.isAuth) throw new Error("Unauthorized user");
            const events = await Event.find({});
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    createEvent: async (args, req) => {
        try {
            if (!req.isAuth) throw new Error("Unauthorized user");
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date),
                creator: "63fc7f2fbdbd868c5db4174e"
            });

            const existUser = await User.findByIdAndUpdate('63fc7f2fbdbd868c5db4174e', { $push: { createdEvents: event._id } });
            if (!existUser) throw new Error("User not found");
            const savedEvent = await event.save();//.populate('creator');

            return transformEvent(savedEvent);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};