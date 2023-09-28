const { login, users, createUser } = require('./auth');
const { allEvents, createEvent, events } = require('./event');
const { bookEvent, bookings, cancelBooking } = require('./booking');

const rootResolver = {
    // ...authResolver,
    // ...eventResolver,
    // ...bookingResolver
};

// module.exports = rootResolver;

module.exports = resolver = {
    Query: {
        login, users, allEvents, events, bookings
    },
    Mutation: {
        createUser, createEvent, bookEvent, cancelBooking
    }
};