const Driver = require("../models/DriverModel");
const Car = require("../models/CarModel");
const bcrypt = require("bcrypt");

const jwt = require("../services/jwt");

const register = async (req, res) => {
    let body = req.body;
    let driver = new Driver();

    if (!body.name || !body.lastName || !body.email || !body.password || !body.idType || !body.idNumber
        || !body.brand || !body.model || !body.color || !body.plateNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyUser = {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        idType: body.idType,
        idNumber: body.idNumber
    }

    let bodyCar = {
        brand: body.brand,
        model: body.model,
        color: body.color,
        plateNumber: body.plateNumber,
        driver: 0
    }

    try {
        const drivers = await Driver.find({ $or: [{ email: bodyUser.email.toLowerCase() }] });

        if (drivers && drivers.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The driver already exists"
            });
        }

        let pwd = await bcrypt.hash(bodyUser.password, 10);
        bodyUser.password = pwd;

        let driver_to_save = new Driver(bodyUser);

        try {
            const driverStored = await driver_to_save.save();

            if (!driverStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No driver saved"
                });
            }

            bodyCar.driver = driverStored._id;

            driver = driverStored;

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving driver"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding driver duplicate"
        });
    }

    try {
        const cars = await Car.find({ $or: [{ plateNumber: bodyCar.plateNumber.toLowerCase() }] });

        if (cars && cars.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The car already exists"
            });
        }

        let car_to_save = new Car(bodyCar);

        try {
            const carStored = await car_to_save.save();

            if (!carStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No car saved"
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
            "message": "Error while finding car duplicate"
        });
    }
}

const login = (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    Driver.findOne({ email: body.email }).then(driver => {
        if (!driver) {
            return res.status(400).json({
                "status": "error",
                "message": "Driver doesn't exist"
            });
        }

        let pwd = bcrypt.compareSync(body.password, driver.password);

        if (!pwd) {
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

    }).catch(() => {
        return res.status(400).json({
            "status": "error",
            "message": "Error while finding driver"
        });
    });
}

const profile = (req, res) => {
    Driver.findById(req.user.id).select({ password: 0 }).then(driver => {
        if (!driver) {
            return res.status(404).json({
                "status": "error",
                "message": "Driver doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "driver": driver
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding driver"
        });
    });
}

const driverById = (req, res) => {
    Driver.findById(req.query.idDriver).then(driver => {
        if (!driver) {
            return res.status(404).json({
                "status": "error",
                "message": "Driver doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "driver": driver
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding driver"
        });
    });
}

module.exports = {
    register,
    login,
    profile,
    driverById
}