const ParkingLot = require("../models/ParkingLotModel");

const list = (req, res) => {
    ParkingLot.find().sort('_id').then(async(parkingLots) => {
        if(!parkingLots) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLots
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
    let ownerId = req.user.id;

    if(!params.parkingName || !params.location || !params.hoursOfAttention || !params.costHours || !params.accept4x4Truck){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    } 

    let paramsParkingLot = {
        parkingName: params.parkingName,
        location: params.location,
        hoursOfAttention: params.hoursOfAttention,
        costHours: params.costHours,
        accept4x4Truck: params.accept4x4Truck,
        owner: ownerId
    }

    try {
        const parkingLots = await ParkingLot.find({$or: [{location: paramsParkingLot.location.toLowerCase()}]});

        if (parkingLots && parkingLots.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The parking lot already exists"
            });
        }

        let parking_lot_to_save = new ParkingLot(paramsParkingLot);

        try {
            const parkingLotStored = await parking_lot_to_save.save();

            if(!parkingLotStored){
                return res.status(500).json({
                    "status": "error",
                    "message": "No parking lot found"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Parking lot registered",
                "parking lot": parkingLotStored
            });
        } catch (error){
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving parking lot",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding parking lot"
        });
    }
}

const parkingLotById = (req, res) => {
    ParkingLot.findById(req.params.id).then(parkingLot => {
        if(!parkingLot){
            return res.status(404).json({
                "status": "error",
                "message": "Parking lot doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "parkingLot": parkingLot
        });
    }).catch( () => {
        return res.status(404).json({
            "status": "error",
            "message": "Parking lot doesn't exist"
        });
    });
}

const editParkingLot = (req, res) => {
    let id = req.params.id;

    ParkingLot.findOneAndUpdate({_id: id}, req.body, {new: true}).then((parkingLotUpdated) => {
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
    }).catch( () => {
        return res.status(404).json({
            status: "error",
            mensaje: "Parking Lot not found"
        })
    })
}

const deleteParkingLot = (req, res) => {
    let id = req.params.id;

    ParkingLot.findOneAndDelete({_id: id}).then((deletedParkingLot) => {
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
    ).catch( () => {
        return res.status(404).json({
            status: "error",
            mensaje: "Parking lot not found"
        })
    });
}
//Endpoits for flutter mobile app v1
const listFromOwner = (req, res) => {
    ParkingLot.find({owner: req.params.id}).sort('_id').then(async(parkingLots) => {
        if(!parkingLots) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLots
        });
    }).catch( error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const createByOwnerId = async(req, res) => {
    let params = req.body;
    let ownerId = req.params.idOwner;

    if(!params.parkingName || !params.location || !params.hoursOfAttention || !params.costHours || !params.accept4x4Truck){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    } 

    let paramsParkingLot = {
        parkingName: params.parkingName,
        location: params.location,
        hoursOfAttention: params.hoursOfAttention,
        costHours: params.costHours,
        accept4x4Truck: params.accept4x4Truck,
        owner: ownerId
    }

    try {
        const parkingLots = await ParkingLot.find({$or: [{location: paramsParkingLot.location.toLowerCase()}]});

        if (parkingLots && parkingLots.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The parking lot already exists"
            });
        }

        let parking_lot_to_save = new ParkingLot(paramsParkingLot);

        try {
            const parkingLotStored = await parking_lot_to_save.save();

            if(!parkingLotStored){
                return res.status(500).json({
                    "status": "error",
                    "message": "No parking lot found"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Parking lot registered",
                "parking lot": parkingLotStored
            });
        } catch (error){
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving parking lot",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding parking lot"
        });
    }
}

module.exports = {
    list,
    parkingLotById,
    create,
    editParkingLot,
    deleteParkingLot,
    listFromOwner,
    createByOwnerId
}