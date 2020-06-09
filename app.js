require('dotenv').config()

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.js");


app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

mongoose.connect(process.env.DATABASE, {   //process.env.DATABASE is to take the fatabase variable form .env file
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED");
});

//All routes
app.use("/api", authRoutes);
 
const port = process.env.PORT || 8000
app.listen(port, () => {
    console.log("app is runnign at 8000");
});