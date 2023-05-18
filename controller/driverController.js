const Driver = require("../models/DriverModel");
const Car = require("../models/CarModel");
const bcrypt = require("bcrypt");

const jwt = require("../services/jwt");

const driverTest = (req, res) => {
    return res.status(200).json({
        "message": "Message sent from controller/driverController.js"
    });
}

const register = async(req, res) => {
    let params = req.body;
    let driver = new Driver();

    if(!params.name || !params.lastName || !params.email || !params.password || !params.idType || !params.idNumber
        || !params.brand || !params.model || !params.color || !params.plateNumber){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    } 

    let paramsUser = {
        name: params.name,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
        idType: params.idType,
        idNumber: params.idNumber
    }

    let paramsCar = {
        brand: params.brand,
        model: params.model,
        color: params.color,
        plateNumber: params.plateNumber,
        driver: 0
    }

    try {
        const drivers = await Driver.find({ $or: [{email: paramsUser.email.toLowerCase()}]});

        if (drivers && drivers.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The driver already exists"
            });
        }

        let pwd = await bcrypt.hash(paramsUser.password, 10);
        paramsUser.password = pwd;

        let driver_to_save = new Driver(paramsUser);

        try {
            const driverStored = await driver_to_save.save();
    
            if(!driverStored){
                return res.status(500).json({
                    "status": "error",
                    "message": "Error while saving driver"
                });
            }

            paramsCar.driver = driverStored._id;

            driver=driverStored;

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving driver"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error finding if user already exists"
        });
    }

    try {
        const cars = await Car.find({$or: [{plateNumber: paramsCar.plateNumber.toLowerCase()}]});

        if (cars && cars.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The car already exists"
            });
        }

        let car_to_save = new Car(paramsCar);

        try {
            const carStored = await car_to_save.save();

            if(!carStored){
                return res.status(500).json({
                    "status": "error",
                    "message": "No car found"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Driver and Car registered",
                "driver": driver,
                "car": carStored
            });
        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving car"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding car"
        });
    }
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
    Driver.findById(req.user.id).select({password: 0}).then(driver => {
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

const driverById = (req, res) => {
    Driver.findById(req.params.id).then(driver => {
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
    profile,
    driverById
}