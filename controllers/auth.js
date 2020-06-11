const User = require("../models/user");
const { validationResult } = require('express-validator'); //to restrict the form of inputs into the database

exports.signup = (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            param : errors.array()[0].param 
        })
    }

    const user = new User(req.body);
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT ABLE TO SAVE USER IN DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        });
    });
}; 

exports.signout = (req, res) => {
    res.json({
        message: "User signout"
    });
};