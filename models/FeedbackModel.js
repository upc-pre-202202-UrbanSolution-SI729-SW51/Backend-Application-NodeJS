const {Schema, model} = require("mongoose");

const FeedbackSchema = Schema({
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    },
    parkingLot: {
        type: Schema.ObjectId,
        ref: "ParkingLot"
    },
    comment: {
        type: String,
        required: true
    },
    stars: {
        type: Number,
        required: true
    }
});

module.exports = model("Feedback", FeedbackSchema, "feedback");