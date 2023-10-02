import { login, users, createUser } from "./auth";
import { allEvents, createEvent, events, deleteEvent } from "./event";
import { bookEvent, bookings, cancelBooking } from "./booking";

export const resolver = {
  Query: {
    login,
    users,
    allEvents,
    events,
    bookings,
    deleteEvent,
  },
  Mutation: {
    createUser,
    createEvent,
    bookEvent,
    cancelBooking,
  },
};
