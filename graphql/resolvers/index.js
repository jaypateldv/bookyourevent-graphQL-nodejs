const { login, users, createUser } = require('./auth');
const { allEvents, createEvent, events, deleteEvent } = require('./event');
const { bookEvent, bookings, cancelBooking } = require('./booking');

module.exports = resolver = {
    Query: {
        login, users, allEvents, events, bookings, deleteEvent
    },
    Mutation: {
        createUser, createEvent, bookEvent, cancelBooking
    }
};
