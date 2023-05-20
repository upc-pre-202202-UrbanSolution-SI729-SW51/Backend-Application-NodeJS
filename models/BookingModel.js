const {Schema, model} = require("mongoose");

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
        ref: "ParakingLot"
    },
    status: {
        type: String,
        required: true
    },
    driverName: {
        type: String,
        required: true
    },
    carBrand: {
        type: String,
        required: true
    },
    carModel: {
        type: String,
        required: true
    },
    parkingLotName: {
        type: String,
        required: true
    },
    parkingLotCostHours: {
        type: String,
        required: true
    }
});

module.exports = model("Booking", BookingSchema, "bookings");