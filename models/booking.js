const { default: mongoose, Schema, mongo } = require("mongoose");

const Schmea = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
},
    {
        timestamps: true
    });

module.exports = mongoose.model('Booking', bookingSchema);