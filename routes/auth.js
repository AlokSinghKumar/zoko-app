var express = require("express");
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require("../controllers/auth");
const { check } = require('express-validator'); //to restrict the form of inputs into the database

router.get("/signout", (req, res) => {
    res.send("user signout");
});

router.post("/signup", 
[
    check("name").isLength({ min: 3}).withMessage('name should be at least 3 character'),
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min : 3}).withMessage('Password should be atleast 3 character'),
] ,
signup
);


router.post("/signin", 
[
    check("email").isEmail().withMessage('email is required'),
    check("password").isLength({ min : 1}).withMessage('Password is required'),
] ,
signin
);

router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router; 