const User = require('../models/users.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {sendEmail} = require('../config/nodemailer.config');

module.exports = {
    register: (req, res) =>{
        const user = new User(req.body);

        user.verificationCode = (Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString())
        
        user.save()
            .then((newUser) =>{
                sendEmail(newUser.email,newUser._id,newUser.verificationCode)

                res.json({
                    message: "Account registered, please check your email for your verification code.",
                    user: newUser
                })
            })
            .catch((err) =>{
                res.status(400).json(err)
            })
    },

    verify: (req,res) =>{
        User.findOne({_id: req.params.userId})
            .then((user) =>{
                if(user.verificationCode === req.params.verificationCode){
                    User.findOneAndUpdate(
                        {_id: req.params.userId},
                        {verified:true},
                        {new:true, runValidators:true}
                    )
                    .then((verifiedUser) =>{
                        res.clearCookie('vtoken');
                        res.clearCookie('utoken');
                        res.json({message: "Verification successful. Log in to continue."})
                    })
                    .catch((err) =>{
                        res.status(400).json({message:"Failed user verification due to internal error."})
                    })
                }
                else{
                    res.status(400).json({message:"That verification code is incorrect."})
                }
            })
            .catch((err) =>res.status(400).json({message:"Could not find user associated with that email.",error:err}))
    },

    resendCode: (req, res) =>{
        const newCode = (Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString());
        
        User.findOne({_id: req.params.userId})
            .then((user) =>{
                if(!user.verified){
                    User.findOneAndUpdate(
                        {_id: req.params.userId},
                        {verificationCode:newCode},
                        {new:true, runValidators:true}
                    )
                    .then((updatedUser) =>{
                        sendEmail(updatedUser.email,updatedUser._id,updatedUser.verificationCode)
                        res.json({
                            message: "New code sent, please check your email.",
                            user: updatedUser
                        })
                    })
                    .catch((err) =>{
                        res.status(400).json({message: "Failed to update user verification code."})
                    })
                }
                else{
                    res.status(400).json({message: "You are already verified, please login.",verified:true})
                }
            })
            .catch((err) =>{
                res.status(400).json({message:"Failed to resend code, could not find user."})
            })
    },

    login: (req, res) =>{
        User.findOne({email: req.body.email})
            .then((userRecord) =>{
                if(userRecord === null){
                    res.status(400).json({message: "Incorrect email/password."})
                }
                else{
                    bcrypt.compare(req.body.password, userRecord.password)
                        .then((isValid) =>{
                            if(isValid){
                                if(userRecord.verified)
                                {
                                    res.cookie(
                                        "utoken",
                                        jwt.sign(
                                            {
                                                user_id: userRecord._id,
                                                email: userRecord.email,
                                                verified: userRecord.verified
                                            },
                                            process.env.JWT_SECRET
                                        ),
                                        {
                                            httpOnly: true,
                                            expires: new Date(Date.now() + 25000000)
                                        }
                                    ).json({
                                        message: "Successful login.",
                                        userId: userRecord._id,
                                        userEmail: userRecord.email,
                                        verified: userRecord.verified
                                    })
                                }
                                else{
                                    res.cookie(
                                        "vtoken",
                                        jwt.sign(
                                            {
                                                user_id: userRecord._id,
                                                email: userRecord.email,
                                                verified: userRecord.verified
                                            },
                                            process.env.JWT_SECRET
                                        ),
                                        {
                                            httpOnly: true,
                                            expires: new Date(Date.now() + 25000000)
                                        }
                                    ).json({
                                        message: "Successful login, please verify with your email code.",
                                        userId: userRecord._id,
                                        userEmail: userRecord.email,
                                        verified: userRecord.verified
                                    })
                                }
                            }
                            else{
                                res.status(400).json({message: "Incorrect email/password."})
                            }
                        })
                        .catch((err) =>{
                            res.status(400).json({message: "Password check failed."})
                        })
                }
            })
            .catch((err) =>{
                res.status(400).json({message: "Email lookup failed."})
            })
    },

    logout: (req,res) =>{
        res.clearCookie('utoken');
        res.clearCookie('vtoken');
        res.json({message: "You have successfully logout."})
    },

    getOneUser: (req,res) =>{
        User.findOne({_id: req.params.id})
            .then((oneUser) =>{
                res.json({oneUser: oneUser})
            })
            .catch((err) =>{
                res.status(400).json(err)
            })
    },

    deleteExistingUser: (req, res) => {
        User.deleteOne({ _id: req.params.id })
            .then(result => res.json({ result: result }))
            .catch(err => res.json({ message: 'Something went wrong (delete)', error: err }));
    },

    getAllUsers: (req,res) =>{
        User.find()
            .then((allUsers) =>{
                res.json({allUsers: allUsers})
            })
            .catch((err) =>{
                res.status(400).json(err)
            })
    },
}