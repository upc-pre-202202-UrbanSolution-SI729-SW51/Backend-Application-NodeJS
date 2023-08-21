const { Schema, model } = require("mongoose");

const SuscriptionSchema = Schema({
    parkingLot: {
        type: Schema.ObjectId,
        ref: "ParkingLot"
    },
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    },
    startDate: {
        type: String,
        required: true
    },
    finishDate: {
        type: String,
        required: true
    }
});

module.exports = model("Suscription", SuscriptionSchema, "suscriptions");