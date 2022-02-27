const mongoose = require('mongoose');

const OrderIssueSchema = new mongoose.Schema({
    issue: {
        type: String,
        required: [true,"Please select an issue."],
        enum: {
            values: [
                "Vendor out of stock",
                "Mfg out of stock",
                "Vendor short",
                "Vendor mispick",
                "Backorder",
                "Vendor discontinued",
                "Mfg discontinued"
            ],
            message:"{VALUE} not supported."
        }
    },

    note: {
        type: String
    },
    
    createdBy: {
        type: String,
        required: [true,"Please input your initials."]
    }
    
}, {timestamps: true});

const OrderIssue = mongoose.model('OrderIssue', OrderIssueSchema);

module.exports = OrderIssue;