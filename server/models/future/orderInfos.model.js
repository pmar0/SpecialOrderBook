const mongoose = require('mongoose');

const OrderInfoSchema = new mongoose.Schema({
    orderIssue: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderIssue"
    },

    orderedDate: {
        type: Date,
        default: Date.now(),
    },

    orderedBy: {
        type: String,
        required: [true,"Please input your initials."]
    },
    
    vendor: {
        type: String,
        required: [true,"Please input a vendor."]
    },
    
    ETADate: {
        type: Date,
    }

}, {timestamps: true});

const OrderInfo = mongoose.model('OrderInfo', OrderInfoSchema);

module.exports = OrderInfo;