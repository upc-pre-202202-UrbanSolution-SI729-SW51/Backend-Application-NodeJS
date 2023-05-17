const {Schema, model} = require("mongoose");

const CarSchema = Schema({
    brand: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    plateNumber: {
        type: String,
        required: true
    },
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    }
});

module.exports = model("Car", CarSchema, "cars");