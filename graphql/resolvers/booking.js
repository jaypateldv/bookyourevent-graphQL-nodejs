const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");
const { GraphQLError } = require("graphql");

module.exports = {

    async bookings(parent, args, contextValue, info) {
        try {
            console.log("=== Users started", info.path.key);
            const { loggedUser, req } = contextValue;
            if (!req.isAuth)
                throw new GraphQLError("Unauthorised user", { extensions: { code: '401' } });
            let filterObject = {};
            for (let key in args) {
                filterObject[key] = args[key];
            }
            const bookings = await Booking.find({ ...filterObject, user: req.authUser });
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
                throw new GraphQLError("Unauthorised user", { extensions: { code: '401' } });
            const fetchedEvent = await Event.findById(args.eventId);
            if (!fetchedEvent)
                throw new Error("Event not found");

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
                throw new GraphQLError("Unauthorised user", { extensions: { code: '401' } });
            const booking = await Booking.findOne({ _id: args.bookingId, user: req.authUser }).populate('event');
            if (!booking)
                throw new GraphQLError("Invalid booking ID or Booking not found", { extensions: { code: '400' } });
            await Booking.deleteOne({ _id: booking._id });
            return transformEvent(booking.event);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};