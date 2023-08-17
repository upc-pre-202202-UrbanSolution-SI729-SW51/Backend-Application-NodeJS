const ParkingLot = require("../models/ParkingLotModel");

const list = (req, res) => {
    ParkingLot.find().sort('_id').then(parkingLots => {
        if (!parkingLots) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLots
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myList = (req, res) => {
    let ownerId = req.user.id;

    ParkingLot.find({ owner: ownerId }).sort('_id').then(parkingLots => {
        if (!parkingLots) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLots
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
    let ownerId = req.user.id;

    if (!body.parkingName || !body.location || !body.hoursOfAttention || !body.costHours || !body.accept4x4Truck
        || !body.totalSpaces || !body.availableSpaces) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyParkingLot = {
        parkingName: body.parkingName,
        location: body.location,
        hoursOfAttention: body.hoursOfAttention,
        costHours: body.costHours,
        accept4x4Truck: body.accept4x4Truck,
        owner: ownerId,
        totalSpaces: body.totalSpaces,
        availableSpaces: body.availableSpaces
    }

    try {
        const parkingLots = await ParkingLot.find({ $or: [{ location: bodyParkingLot.location.toLowerCase() }] });

        if (parkingLots && parkingLots.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The parking lot already exists"
            });
        }

        let parking_lot_to_save = new ParkingLot(bodyParkingLot);

        try {
            const parkingLotStored = await parking_lot_to_save.save();

            if (!parkingLotStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No parking lot saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Parking lot registered",
                "parking lot": parkingLotStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving parking lot",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding parking lot duplicate"
        });
    }
}

const parkingLotById = (req, res) => {
    ParkingLot.findById(req.query.idParking).then(parkingLot => {
        if (!parkingLot) {
            return res.status(404).json({
                "status": "error",
                "message": "Parking lot doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "parkingLot": parkingLot
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding parking lot"
        });
    });
}

const editParkingLot = (req, res) => {
    let id = req.query.idParkingLot;

    ParkingLot.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(parkingLotUpdated => {
        if (!parkingLotUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Parking Lot not found"
            })
        }
        return res.status(200).send({
            status: "success",
            parkingLot: parkingLotUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating parking lot"
        })
    })
}

const deleteParkingLot = (req, res) => {
    let id = req.query.idParkingLot;

    ParkingLot.findOneAndDelete({ _id: id }).then(deletedParkingLot => {
        if (!deletedParkingLot) {
            return res.status(404).json({
                status: "error",
                mensaje: "Parking lot not found"
            })
        }
        return res.status(200).send({
            status: "success",
            parkingLot: deletedParkingLot
        });
    }
    ).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and deleting parking lot"
        })
    });
}

module.exports = {
    list,
    myList,
    parkingLotById,
    create,
    editParkingLot,
    deleteParkingLot
}