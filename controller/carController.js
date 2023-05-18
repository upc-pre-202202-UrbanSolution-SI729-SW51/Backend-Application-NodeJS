const Car = require("../models/CarModel");

const list = (req, res) => {
    Car.find().sort('_id').then( cars => {
        if(!cars) {
            return res.status(404).json({
                status: "Error",
                message: "No cars avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            cars
        });
    }).catch( error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const create = async(req, res) => {
    let params = req.body;
    let driverId = req.user.id;

    if(!params.brand || !params.model || !params.color || !params.plateNumber){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    } 

    let paramsCar = {
        brand: params.brand,
        model: params.model,
        color: params.color,
        plateNumber: params.plateNumber,
        driver: driverId
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
                "message": "Car registered",
                "car": carStored
            });
        } catch (error){
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving car",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding car"
        });
    }
}

const carById = (req, res) => {
    Car.findById(req.params.id).then(car => {
        if(!car){
            return res.status(404).json({
                "status": "error",
                "message": "Car doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "car": car
        });
    }).catch( () => {
        return res.status(404).json({
            "status": "error",
            "message": "Car doesn't exist"
        });
    });
}

module.exports = {
    list,
    create,
    carById
}