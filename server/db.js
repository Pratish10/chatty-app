const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
  "mongodb+srv://jack:jack123@cluster0.ftlyigr.mongodb.net/?retryWrites=true&w=majority",
  () => {
    console.log("Connected to Database");
  }
);
