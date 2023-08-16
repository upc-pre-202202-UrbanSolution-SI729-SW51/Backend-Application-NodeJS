const { Schema, model } = require("mongoose");

const AditionalServiceSchema = Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

module.exports = model("AditionalService", AditionalServiceSchema, "aditionalServices");