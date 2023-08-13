const { Schema, model } = require("mongoose");

const ParkingLotSchema = Schema({
    parkingName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    hoursOfAttention: {
        type: String,
        required: true
    },
    costHours: {
        type: String,
        required: true
    },
    accept4x4Truck: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.ObjectId,
        ref: "Owner"
    }
});

module.exports = model("ParkingLot", ParkingLotSchema, "parkingLots");