const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");
const { GraphQLError } = require("graphql");
const CustomError = require("../../helpers/customError");

module.exports = {

    async bookings(parent, args, contextValue, info) {
        try {
            const { loggedUser, req } = contextValue;
            console.log("=== bookings started", req.isAuth);
            if (!req.isAuth)
                throw new CustomError("Unauthorised user", 401);
            let filterObject = {};
            for (let key in args) {
                filterObject[key] = args[key];
            }
            const bookings = await Booking.find({ ...filterObject, user: loggedUser._id });
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async bookEvent(parent, args, contextValue, info) {
        try {
            console.log("=== Users started", info.path.key);
            const { loggedUser, req } = contextValue;
            if (!req.isAuth)
                throw new CustomError("Unauthorised user", 401);
            const fetchedEvent = await Event.findById(args.eventId);
            if (!fetchedEvent)
                throw new CustomError("Event not found", 400);
            const booking = new Booking({
                user: req.authUser,
                event: fetchedEvent
            });
            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async cancelBooking(parent, args, contextValue, info) {
        try {
            console.log("=== Users started", info.path.key);
            const { loggedUser, req } = contextValue;
            if (!req.isAuth)
                throw new CustomError("Unauthorised user", 401);
            const booking = await Booking.findOne({ _id: args.bookingId, user: req.authUser }).populate('event');
            if (!booking)
                throw new CustomError("Invalid booking ID or Booking not found", 400);
            await Booking.deleteOne({ _id: booking._id });
            return transformEvent(booking.event);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};