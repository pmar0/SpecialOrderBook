const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const otherEmailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const EMAIL_REGEX = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true,"Email is required."],
        match: [EMAIL_REGEX,"Please input a valid email address."]
    },
    password:{
        type: String,
        required: [true, "Password is required."],
        minlength: [8, "Password must be at least 8 characters long."]
    },
    role:{
        type: String
    },
    verificationCode:{
        type: String
    },
    verified:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

UserSchema.virtual('confirmPassword')
    .get(() => this._confirmPassword)
    .set((value) => this._confirmPassword = value)

UserSchema.pre('validate', function(next){
    if(this.password !== this.confirmPassword){
        this.invalidate('confirmPassword', "Passwords must match.")
    }
    next();
})

UserSchema.pre('save', function(next){
    bcrypt.hash(this.password, 10)
        .then((hashedPassword) =>{
            this.password = hashedPassword;
            next();
        })
})

const User = mongoose.model('User', UserSchema);

module.exports = User;