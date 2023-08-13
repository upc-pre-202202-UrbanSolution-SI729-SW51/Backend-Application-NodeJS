const { Schema, model } = require("mongoose");

const BookingSchema = Schema({
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    },
    car: {
        type: Schema.ObjectId,
        ref: "Car"
    },
    parkingLot: {
        type: Schema.ObjectId,
        ref: "ParkingLot"
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = model("Booking", BookingSchema, "bookings");