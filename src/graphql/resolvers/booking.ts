import { GraphQLError } from "graphql";
import { EventDocument, Event } from "../../models/event";
import { BookingDocument, Booking } from "../../models/booking";
import { transformBooking, transformEvent } from "./merge";
import { CustomError } from "../../helpers/customError";

interface ContextValue {
  loggedUser: {
    _id: string;
  };
  req: {
    isAuth: boolean;
    authUser: string;
  };
}

interface BookingsArgs {
  [key: string]: any;
}

interface BookEventArgs {
  eventId: string;
}

interface CancelBookingArgs {
  bookingId: string;
}

async function bookings(
  parent: any,
  args: BookingsArgs,
  contextValue: ContextValue,
  info: any
) {
  try {
    const { loggedUser, req } = contextValue;
    console.log("=== bookings started", req.isAuth);
    if (!req.isAuth) throw new CustomError("Unauthorised user", 401);

    let filterObject: BookingsArgs = {};
    for (let key in args) {
      filterObject[key] = args[key];
    }

    const bookings = await Booking.find({
      ...filterObject,
      user: loggedUser._id,
    });
    return bookings.map((booking: BookingDocument) => {
      return transformBooking(booking);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function bookEvent(
  parent: any,
  args: BookEventArgs,
  contextValue: ContextValue,
  info: any
) {
  try {
    console.log("=== Users started", info.path.key);
    const { req } = contextValue;
    if (!req.isAuth) throw new CustomError("Unauthorised user", 401);

    const fetchedEvent = await Event.findById(args.eventId);
    if (!fetchedEvent) throw new CustomError("Event not found", 400);

    const booking = new Booking({
      user: req.authUser,
      event: fetchedEvent,
    });

    const result = await booking.save();
    return transformBooking(result);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function cancelBooking(
  parent: any,
  args: CancelBookingArgs,
  contextValue: ContextValue,
  info: any
) {
  try {
    console.log("=== Users started", info.path.key);
    const { req } = contextValue;
    if (!req.isAuth) throw new CustomError("Unauthorised user", 401);

    const booking = await Booking.findOne({
      _id: args.bookingId,
      user: req.authUser,
    }).populate("event");
    if (!booking)
      throw new CustomError("Invalid booking ID or Booking not found", 400);

    await Booking.deleteOne({ _id: booking._id });
    return transformEvent(booking.event);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { cancelBooking, bookings, bookEvent };
