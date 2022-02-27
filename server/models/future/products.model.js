const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true,"Product description is required."]
    },
    
    brand: {
        type: String
    },
    
    UPC: {
        type: String,
        minlength: [12,"Must be at least 12 digits long."]
    }
}, {timestamps: true});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;