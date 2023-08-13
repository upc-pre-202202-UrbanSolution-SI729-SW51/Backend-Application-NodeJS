const { Schema, model } = require("mongoose");

const AditionalServiceSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: Number,
        required: true
    }
});

module.exports = model("AditionalService", AditionalServiceSchema, "aditionalServices");