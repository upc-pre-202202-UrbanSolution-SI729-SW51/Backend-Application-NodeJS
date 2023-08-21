const { Schema, model } = require("mongoose");

const SuscriptionRequestSchema = Schema({
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    },
    parkingLot: {
        type: Schema.ObjectId,
        ref: "ParkingLot"
    },
    message: {
        type: String,
        required: true
    },
    timeRequested: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    ownerAnswer: {
        type: String,
        required: true
    },
});

module.exports = model("SuscriptionRequest", SuscriptionRequestSchema, "suscriptionRequests");