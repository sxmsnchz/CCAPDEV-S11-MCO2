require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/orgspace")
    .then(() => {
        console.log("MongoDB connected.");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });
