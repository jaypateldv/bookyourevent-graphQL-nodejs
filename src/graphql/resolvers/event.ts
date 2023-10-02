import { GraphQLError } from "graphql";
import mongoose, { isValidObjectId, Document } from "mongoose";
import { CustomError } from "../../helpers/customError";
import { getPaginationParams } from "../../helpers/utils";
import { Booking, BookingDocument } from "../../models/booking";
import { Event, EventDocument } from "../../models/event";
import { User } from "../../models/user";
import { transformEvent } from "./merge";

interface ContextValue {
  loggedUser: {
    _id: string;
  };
  req: {
    isAuth: boolean;
    authUser: string;
  };
}

interface EventsArgs {
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

interface DeleteEventArgs {
  eventId: string;
}

interface AllEventsArgs {
  [key: string]: any;
}

interface CreateEventArgs {
  eventInput: {
    title: string;
    description: string;
    price: number;
    date: string;
  };
}

interface DeleteEventResponse {
  message: string;
}

const events = async (
  parent: any,
  args: EventsArgs,
  contextValue: ContextValue,
  info: any
) => {
  try {
    console.log("== Events started");
    const { loggedUser, req } = contextValue;
    if (!req.isAuth) {
      throw new CustomError("Unauthorized User", 401);
    }

    const { limit, skip, sortBy, sortOrder } = getPaginationParams(args);
    let filterObject: Record<string, any> = {};
    const events = await Event.find({
      ...filterObject,
      creator: loggedUser._id,
    })
      // set sorting order issue
      .sort({ [sortBy]: 1 })
      .skip(skip)
      .limit(limit);

    const totalDocuments = await Event.countDocuments({
      ...filterObject,
      creator: loggedUser._id,
    });

    return {
      events: events.map((event: EventDocument) => {
        return transformEvent(event);
      }),
      total: totalDocuments,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
const deleteEvent = async (
  parent: any,
  args: DeleteEventArgs,
  contextValue: ContextValue,
  info: any
) => {
  try {
    console.log("== deleteEvent", args);
    const { loggedUser, req } = contextValue;
    if (!req.isAuth) throw new CustomError("Unauthorized User", 401);
    if (!args.eventId || !isValidObjectId(args.eventId))
      throw new CustomError("Required Valid Event Id", 400);

    const deletedEvent = await Event.findOneAndDelete({
      _id: args.eventId,
      creator: loggedUser._id,
    });
    await Booking.deleteMany({ event: deletedEvent });

    console.log("deletedEvent", deletedEvent);
    if (deletedEvent)
      return {
        message: "Event deleted successfully.",
      };
    else {
      throw new CustomError("Event not found", 400);
    }
  } catch (error) {
    console.error("## Error", error);
    throw error;
  }
};
const allEvents = async (
  parent: any,
  args: AllEventsArgs,
  contextValue: ContextValue,
  info: any
) => {
  try {
    console.log("== AllEvents started");
    const { loggedUser, req } = contextValue;
    if (!req.isAuth) {
      throw new CustomError("Unauthorised user", 401);
    }
    let filterObject: AllEventsArgs = {};
    for (let key in args) {
      filterObject[key] = args[key];
    }
    const events = await Event.find({ ...filterObject }).sort({
      createdAt: 1,
    });

    return events.map((event: EventDocument) => {
      return transformEvent(event);
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

async function createEvent(
  parent: any,
  args: CreateEventArgs,
  contextValue: ContextValue,
  info: any
) {
  try {
    console.log("== CreateEvent started");
    const { req } = contextValue;
    if (!req.isAuth) throw new CustomError("Unauthorized user", 401);

    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: req.authUser,
    });

    const existUser = await User.findByIdAndUpdate(req.authUser, {
      $push: { createdEvents: event._id },
    });
    if (!existUser) throw new CustomError("User not found", 400);

    const savedEvent = await event.save();
    return transformEvent(savedEvent);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { events, allEvents, createEvent, deleteEvent };
