const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
    status: {
        type: String,
        required: [true,"Select a status."],
        enum: {
            values: [
                "In Book",
                "On Order",
                "In Transit",
                "Awaiting Pickup",
                "Completed",
                "Backorder",
                "Cancelled"
            ],
            message:"{VALUE} not supported."
        }
    },

    BackorderETA: {
        type: date
    },

    CancelReason:{
        type: String
    },

    CancelNote:{
        type: String
    },

    createdBy: {
        type: String,
        required: [true,"Please input your initials."]
    }

}, {timestamps: true});

const Status = mongoose.model('Status', StatusSchema);

module.exports = Status;