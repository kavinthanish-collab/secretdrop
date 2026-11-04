
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
            trim: true
        },

        secretCodeHash: {
            type: String,
            required: true
        },

        images: {
            type: [String],
            default: []
        },

        // Response submitted by the receiver
        response: {
            type: String,
            default: "",
            trim: true
        },

        // Date when the receiver submitted the response
        respondedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
