import { Document } from "mongoose";
import { dateToString } from "../../helpers/date";
import { Event } from "../../models/event";
import { Booking } from "../../models/booking";
import { User } from "../../models/user";

// interface TransformedBooking {
//   user: () => Promise<>;
//   event: () => Promise<>;
//   createdAt: string;
//   updatedAt: string;
//   [key: string]: any;
// }

// interface TransformedEvent {
//   date: string;
//   creator: () => Promise<UserDocument>;
//   users: () => Promise<UserDocument[]>;
//   [key: string]: any;
// }

const transformBooking = (booking: any) => {
  return {
    ...booking._doc,
    user: user.bind(this, booking.user as string),
    event: event.bind(this, booking.event as string),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  };
};

const transformEvent = (event: any): any => {
  return {
    ...event._doc,
    date: dateToString(event.date),
    creator: user.bind(this, event.creator),
    users: bookedUsers.bind(this, event._id),
  };
};

const bookedUsers = async (eventId: string) => {
  try {
    const data = await Booking.find({ event: eventId }).populate("user");
    return data.map((b: any) => b.user._doc);
  } catch (error) {
    // Handle the error appropriately
    throw error;
  }
};

const user = (userId: string) => {
  return User.findById(userId).then((user: any) => {
    if (!user) {
      throw new Error("User not found");
    }

    return {
      ...user._doc,
      password: null,
      createdEvents: events.bind(this, user.createdEvents),
    };
  });
};

const event = (eventId: string) => {
  return Event.findById(eventId).then((event: any) => {
    if (!event) {
      throw new Error("Event not found");
    }

    return {
      ...event._doc,
    };
  });
};

const singleEvent = async (eventId: string) => {
  try {
    const event = await Event.findById(eventId);
    return event;
  } catch (error) {
    throw error;
  }
};

const events = (eventIds: string[]) => {
  return Event.find({ _id: { $in: eventIds } }).then((events) => {
    return events.map((event) => {
      return transformEvent(event);
    });
  });
};

export {
  bookedUsers,
  user,
  events,
  singleEvent,
  transformBooking,
  transformEvent,
};
