const { Schema, model } = require("mongoose");

const MessageSchema = Schema({
    driver: {
        type: Schema.ObjectId,
        ref: "Driver"
    },
    owner: {
        type: Schema.ObjectId,
        ref: "Owner"
    },
    message: {
        type: String,
        required: true
    },
    senderReceiver: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    seen: {
        type: Boolean,
        default: false
    }
});

module.exports = model("Message", MessageSchema, "messages");