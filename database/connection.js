const mongoose = require("mongoose");

const connection = async(uri) => {
    try {

        await mongoose.connect(uri);
        console.log("Connected to the api_rest_social_media database");

    } catch(error) {

        console.log(error);
        throw new Error("Could not connect to the database");

    }
}

module.exports = {
    connection
}