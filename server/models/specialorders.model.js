const mongoose = require('mongoose');

//////////Also for dumbed down code//////////////
const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const optionalMinMax = (type, minLength = 1, maxLength = Infinity) => {
    let adaptMessage = ""
    const numOrText = type==='num'?'digit(s)':'character(s)'

    if(minLength === maxLength){
        adaptMessage = `Must be ${minLength} ${numOrText} long.`
    }
    else if(maxLength === Infinity){
        adaptMessage = `Must be at least ${minLength} ${numOrText} long.`
    }
    else if(minLength === 1){
        adaptMessage = `Must be less than ${maxLength} ${numOrText} long.`
    }
    return {
        validator: function(value) {
        if (value === undefined || value.length === 0) return true;
        return value.length >= minLength && value.length <= maxLength;
    },
    message: adaptMessage
    }
}

const pairReq = (pairField) => {
    //designed to force either home phone# or cell phone#, but we'll try that later..pairField wont work, might need pre validation solution or something
    return {
        validator: function(value) {
        if (value.length > 0 || pairField.length > 0) return true;
        return false
    },
    message: "Field is required."
    }
}

const SpecialOrderSchema = new mongoose.Schema({
    // product: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Product"
    // },

    // customer: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Customer"
    // },

    creatorUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    // statusHistory: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Status"
    // }],

    // orderInfo: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "OrderInfo"
    // }],
    ////////////////Block of dumbed down code, will later be replaced by above in development///////////////
    productDescription: {
        type: String,
        required: [true,"Product description is required."]
    },
    
    productBrand: {
        type: String
    },
    
    productUPC: {
        type: String,
        validate: optionalMinMax('num',12)
    },

    statuses: [{
        type: String,
        // required: [true,"Select a status."],
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
        },
    }],

    orderedDate: {
        type: Date,
        // default: Date.now(),
    },

    orderInfoOrderedBy: {
        type: String,
        // required: [true,"Please input your initials."]
    },
    
    orderInfoVendor: {
        type: String,
        // required: [true,"Please input a vendor."]
    },
    
    orderInfoETADate: {
        type: Date,
    },

    orderIssues: [{
        type: String,
        // required: [true,"Please select an issue."],
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
    }],

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
        validate: optionalMinMax('num',10,10),
    },
    
    cellPhone: {
        type: String,
        validate: optionalMinMax('num',10,10),
    },
    
    email: {
        type: String,
        match: [EMAIL_REGEX,"Please input a valid email address."]
    },

    /////////////////////////////////End of dumbed down code//////////////////////////////////////
    customerAltName: {
        type: String,
        validate: optionalMinMax('text',2)
    },

    customerAltPhoneNumber: {
        type: String,
        validate: optionalMinMax('num',10,10)
    },

    category: {
        type: String,
        required: [true,"Please select a category."],
        enum: {
            values:[
                "Grocery",
                "Supplements",
                "Health and Beauty",
                "Professional Supplements",
                "Produce",
                "Other"
            ],
            message:"{VALUE} not supported."
        }
    },

    orderQuantity: {
        type: Number,
        required: [true,"Please input a quantity. Input 0 for a product request."],
        min: [0,"Quantity must be 0 or greater."]
    },

    location: {
        type: String,
        required: [true,"Please specify product hold location."],
        default: "N/A"
    },

    createdBy: {
        type: String,
        required: [true,"Please input your initials."]
    },

    notes: {
        type: String
    }
    
}, {timestamps: true});

const specialOrder = mongoose.model('specialOrder', SpecialOrderSchema);

module.exports = specialOrder;