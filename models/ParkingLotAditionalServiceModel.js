const { Schema, model } = require("mongoose");

const ParkingLotAditionalServiceSchema = Schema({
    parkingLot: {
        type: Schema.ObjectId,
        ref: "ParkingLot"
    },
    aditionalService: {
        type: Schema.ObjectId,
        ref: "AditionalService"
    },
    price: {
        type: Number,
        required: true
    }
});

module.exports = model("ParkingLotAditionalService", ParkingLotAditionalServiceSchema, "parkingLot-aditionalService");