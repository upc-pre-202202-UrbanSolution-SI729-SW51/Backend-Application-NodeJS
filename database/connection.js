const mongoose = require("mongoose");

const connection = async() => {
    try {

        await mongoose.connect("mongodb://mongo:2NzrokZ1ARrklHZbxiBP@containers-us-west-105.railway.app:7108/");
        console.log("Connected to the api_rest_social_media database");

    } catch(error) {

        console.log(error);
        throw new Error("Could not connect to the database");

    }
}

module.exports = {
    connection
}