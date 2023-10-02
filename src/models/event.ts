import { Document, Schema, model, Types } from "mongoose";

interface Event {
  title: string;
  description: string;
  price: number;
  date: Date;
  creator: Types.ObjectId | string;
}

interface EventDocument extends Event, Document {}

const eventSchema = new Schema<Event>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Event = model<EventDocument>("Event", eventSchema);

export { EventDocument, Event };
