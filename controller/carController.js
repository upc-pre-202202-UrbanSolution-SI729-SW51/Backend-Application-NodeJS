const Car = require("../models/CarModel");

const list = (req, res) => {
    Car.find().sort('_id').then(cars => {
        if (!cars) {
            return res.status(404).json({
                status: "Error",
                message: "No cars avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            cars
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myList = (req, res) => {
    let driverId = req.user.id;

    Car.find({ driver: driverId }).sort('_id').then(cars => {
        if (!cars) {
            return res.status(404).json({
                status: "Error",
                message: "No cars avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            cars
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const create = async (req, res) => {
    let body = req.body;
    let driverId = req.user.id;

    if (!body.brand || !body.model || !body.color || !body.plateNumber) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyCar = {
        brand: body.brand,
        model: body.model,
        color: body.color,
        plateNumber: body.plateNumber,
        driver: driverId
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
                "message": "Car registered",
                "car": carStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving car",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding car duplicate"
        });
    }
}

const carById = (req, res) => {
    Car.findById(req.query.idCar).then(car => {
        if (!car) {
            return res.status(404).json({
                "status": "error",
                "message": "Car doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "car": car
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding car"
        });
    });
}

module.exports = {
    list,
    myList,
    create,
    carById
}