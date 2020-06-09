var express = require("express");
var router = express.Router();
const {signout, signup} = require("../controllers/auth");

router.get("/signout", (req, res) => {
    res.send("user signout");
});

router.post("/signup", signup);

module.exports = router; 