const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");

module.exports = {

    bookings: async (args, req) => {
        try {
            if (!req.isAuth) throw new Error("Unauthorized user");
            const bookings = await Booking.find({});
            return bookings.map(booking => {
                return transformBooking(booking);
            });
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    bookEvent: async (args, req) => {
        try {
            if (!req.isAuth) throw new Error("Unauthorized user");
            const fetchedEvent = await Event.findById(args.eventId);
            if (!fetchedEvent)
                throw new Error("Event not found");

            const booking = new Booking({
                user: "63fc7f2fbdbd868c5db4174e",
                event: fetchedEvent
            });

            const result = await booking.save();
            return transformBooking(result);
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    cancelBooking: async (args, req) => {
        try {
            if (!req.isAuth) throw new Error("Unauthorized user");
            const booking = await Booking.findById(args.bookingId).populate('event');
            if (!booking) throw new Error("Invalid booking ID or Booking not found");
            await Booking.deleteOne({ _id: booking._id });
            return transformEvent(booking.event);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};