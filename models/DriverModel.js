const {Schema, model} = require("mongoose");

const DriverSchema = Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    idNumber: {
        type: String,
        required: true
    },
    idType: {
        type: String,
        required: true
    }
});

module.exports = model("Driver", DriverSchema, "drivers");