const SpecialOrder = require('../models/specialorders.model');
const jwt = require('jsonwebtoken');

module.exports = {
    findAllSpecialOrders: (req, res) => {
        SpecialOrder.find()
            // .populate('creatorUser','email')
            .then(allSpecialOrders => res.json({ specialOrders: allSpecialOrders }))
            .catch(err => res.json({ message: 'Something went wrong (find all)', error: err }));
    },
    
    // findSpecialOrdersByUser: (req, res) => {
    //     SpecialOrder.find({creatorUser: req.params.userId})
    //         // .populate('creatorUser','email')
    //         .then(allSpecialOrders => res.json({ specialOrders: allSpecialOrders }))
    //         .catch(err => res.json({ message: 'Something went wrong (find all)', error: err }));
    // },
    
    findOneSpecialOrder: (req, res) => {
        SpecialOrder.findOne({ _id: req.params.id })
            .then(oneSpecialOrder => res.json({ specialOrder: oneSpecialOrder }))
            .catch(err => res.json({ message: 'Something went wrong (findOne)', error: err }));
    },
    
    createNewSpecialOrder: (req, res) => {
        const NewSpecialOrder = new SpecialOrder(req.body);
        const decodedJWT = jwt.decode(req.cookies.utoken,{
            complete: true
        });

        NewSpecialOrder.creatorUser = decodedJWT.payload.user_id;
        NewSpecialOrder.statuses.push("In Book")

        NewSpecialOrder.save()
            .then(async (newSpecialOrder) => {
                await newSpecialOrder.populate('creatorUser','email');
                res.json({ specialOrder: newSpecialOrder })
            })
            .catch(err => res.status(400).json({ message: 'Something went wrong (create)', error: err }));
    },
    
    updateExistingSpecialOrder: (req, res) => {
        SpecialOrder.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        )
            .then(updatedSpecialOrder => res.json({ specialOrder: updatedSpecialOrder }))
            .catch(err => res.status(400).json({ message: 'Something went wrong (update)', error: err }));
    },
    
    deleteExistingSpecialOrder: (req, res) => {
        SpecialOrder.deleteOne({ _id: req.params.id })
            .then(result => res.json({ result: result }))
            .catch(err => res.json({ message: 'Something went wrong (delete)', error: err }));
    }
}