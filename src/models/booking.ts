import { Document, Schema, model, Types } from "mongoose";

interface Booking {
  event: Types.ObjectId | string;
  user: Types.ObjectId | string;
}

interface BookingDocument extends Booking, Document {}

const bookingSchema = new Schema<Booking>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model<BookingDocument>("Booking", bookingSchema);
export { Booking, BookingDocument };
