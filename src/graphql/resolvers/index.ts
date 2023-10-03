import { login, users, createUser, allUsers } from "./auth";
import { allEvents, createEvent, events, deleteEvent } from "./event";
import { bookEvent, bookings, cancelBooking } from "./booking";
import { uploadProfilePhoto } from "./file";
import { UserRole } from "../Scalars/userRole.scalar";
export const resolver = {
  UserRole,
  Query: {
    login,
    users,
    allEvents,
    events,
    bookings,
    deleteEvent,
    allUsers,
  },
  Mutation: {
    createUser,
    createEvent,
    bookEvent,
    cancelBooking,
    uploadProfilePhoto,
  },
};
