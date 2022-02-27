const mongoose = require('mongoose');

const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const CustomerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true,"First name is required."],
        minlength: [2,"First name must be a minimum of 2 characters."]
    },
    
    lastName: {
        type: String,
        required: [true,"Last name is required. Please input at least last initial."],
    },
    
    keytag: {
        type: Number,
        min: [0,"Keytag must be a positive number."]
    },
    
    homePhone: {
        type: String,
        minlength: [10,"Must be 10 digits long."],
        maxlength: [10,"Must be 10 digits long."]
    },
    
    cellPhone: {
        type: String,
        minlength: [10,"Must be 10 digits long."],
        maxlength: [10,"Must be 10 digits long."]
    },
    
    email: {
        type: String,
        match: [EMAIL_REGEX,"Please input a valid email address."]
    }
    
}, {timestamps: true});

const Customer = mongoose.model('Customer', CustomerSchema);

module.exports = Customer;