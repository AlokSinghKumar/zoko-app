const User = require("../models/user");
const { validationResult } = require('express-validator'); //to restrict the form of inputs into the database
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");


exports.signup = (req, res) => {
    const errors = validationResult(req);

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

exports.signin = (req, res) => {
    const errors = validationResult(req);
    const {email, password} = req.body;     //destructuring the re.body, it will match the key and assign the vlue according to the key inside {}

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg,
            param : errors.array()[0].param 
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error : "USER email does not exists"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password fo not match"
            })
        }

        //CREATE TOKEN
        const token = jwt.sign({_id : user._id}, process.env.SECRET)
        //PUT TOKEN IN COOOKIE
        res.cookie("token", token, {expire: new Date() + 9999});

        //send response to front end
        const {_id, name, email, role} = user;
        return res.json({token, user : {_id, name, email, role}});
    });
};

exports.signout = (req, res) => {
    res.clearCookie("token");   //clearCookie() comes form cokieParser form npm
    res.json({
        message: "User signout sucessfuly"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth"  //the userProperty goes into the request in the router
});

//custom middleware
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id === req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}


exports.isAdmin = (req, res, next) => {
    if(Req.profile.role == 0){
        return res.ststus(403).json({
            error: "YOU ARE NOT ADMIN"
        });
    }
    next();
}
