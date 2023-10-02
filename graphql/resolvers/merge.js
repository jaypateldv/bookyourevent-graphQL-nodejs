const { dateToString } = require('../../helpers/date');
const Event = require('../../models/event');
const Booking = require('../../models/booking');
const User = require('../../models/user');

const transformBooking = booking => {
    return {
        ...booking._doc,
        user: user.bind(this, booking.user),
        event: event.bind(this, booking.event),
        createdAt: dateToString(booking.createdAt),
        updatedAt: dateToString(booking.updatedAt)
    };
};

const transformEvent = event => {
    return {
        ...event._doc,
        date: dateToString(event.date),
        creator: user.bind(this, event.creator),
        users: bookedUsers.bind(this, event._id)
    };
};

const bookedUsers = async eventId => {
    try {
        const data = await Booking.find({ event: eventId }).populate('user');
        return data.map((b) => b.user._doc);
    } catch (error) {

    }
};

const user = userId => {
    return User.findById(userId).then(user => {
        return {
            ...user._doc,
            password: null,
            createdEvents: events.bind(this, user.createdEvents)
        };
    });
};

const event = eventId => {
    return Event.findById(eventId).then(event => {
        return {
            ...event._doc,
        };
    });
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return event;
    } catch (error) {
        throw error;
    }
};

const events = eventIds => {
    return Event.find({ _id: { $in: eventIds } })
        .then(events => {
            return events.map(event => {
                return transformEvent(event);
            });
        });
};

module.exports = { bookedUsers, user, events, singleEvent, transformBooking, transformEvent };