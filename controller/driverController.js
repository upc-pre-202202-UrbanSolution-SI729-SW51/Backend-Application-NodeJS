const Driver = require("../models/DriverModel")
const bcrypt = require("bcrypt");
const mongoosePaginate = require("mongoose-pagination");
const fs = require("fs")
const path = require("path")

const jwt = require("../services/jwt");

const driverTest = (req, res) => {
    return res.status(200).json({
        "message": "Message sent from controller/driverController.js"
    });
}

const register = (req, res) => {
    let params = req.body;

    if(!params.name || !params.lastName || !params.email || !params.password || !params.idType || !params.idNumber){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    } 

    Driver.find({ $or: [

        {email: params.email.toLowerCase()}

    ]}).then( async(drivers) => {

        if (drivers && drivers.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The driver already exists"
            });
        }

        let pwd = await bcrypt.hash(params.password, 10);
        params.password = pwd;

        let driver_to_save = new Driver(params);

        driver_to_save.save().then(driverStored => {
            if(!driverStored){

                return res.status(500).json({
                    "status": "error",
                    "message": "Error while saving driver"
                });

            }
            return res.status(200).json({
                "status": "success",
                "message": "Driver registered",
                "driver": driverStored
            });

        }).catch( () => {

            return res.status(500).json({
                "status": "error",
                "message": "Error while saving driver"
            });

        });
    }).catch( error => {

        return res.status(500).json({
            "status": "error",
            "message": "Missing data"
        });

    });
}

const login = (req, res) => {
    const params = req.body;

    if(!params.email || !params.password){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    Driver.findOne({email: params.email}).then( driver =>{
        if(!driver){
            return res.status(400).json({
                "status": "error",
                "message": "Driver doesn't exist"
            });
        }

        let pwd = bcrypt.compareSync(params.password, driver.password);

        if(!pwd){
            return res.status(400).json({
                "status": "error",
                "message": "Passwords doesn't match"
            });
        }

        const token = jwt.createToken(driver);

        return res.status(200).json({
            "status": "success",
            "message": "You have identified correctly",
            driver: {
                id: driver._id,
                name: driver.name,
                lastName: driver.lastName
            },
            token
        });

    }).catch( error => {
        return res.status(400).json({
            "status": "error",
            "message": "Driver doesn't exist"
        });
    });
}

const profile = (req, res) => {
    Driver.findById(req.driver.id).select({password: 0}).then(driver => {
        if(!driver){
            return res.status(404).json({
                "status": "error",
                "message": "Driver doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "driver": driver
        });
    }).catch( () => {
        return res.status(404).json({
            "status": "error",
            "message": "Driver doesn't exist"
        });
    });
}

module.exports = {
    driverTest,
    register,
    login,
    profile
}