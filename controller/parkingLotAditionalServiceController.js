const ParkingLotAditionalService = require("../models/ParkingLotAditionalServiceModel");

const create = async (req, res) => {
    let body = req.body;
    let parkingLotId = req.query.idParkingLot;
    let aditionalServiceId = req.query.idAditionalService;

    if (!body.price) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyParkingAditionalService = {
        parkingLot: parkingLotId,
        aditionalService: aditionalServiceId,
        price: body.price
    }

    try {
        const parkingLotsAditionalServices = await ParkingLotAditionalService.find({ $and: [{ parkingLot: bodyParkingAditionalService.parkingLot.toLowerCase() }, { aditionalService: bodyParkingAditionalService.aditionalService.toLowerCase() }] });

        if (parkingLotsAditionalServices && parkingLotsAditionalServices.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The parking lots and aditional services already exists"
            });
        }

        let parking_lot_aditional_service_to_save = new ParkingLotAditionalService(bodyParkingAditionalService);

        try {
            const parkingLotAditionalServiceStored = await parking_lot_aditional_service_to_save.save();

            if (!parkingLotAditionalServiceStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "No parking lot and aditional service saved"
                });
            }

            return res.status(200).json({
                "status": "success",
                "message": "Campus and doctor registered",
                "parkingLotAditionalService": parkingLotAditionalServiceStored
            });
        } catch (error) {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving parking lot and aditional service",
                error
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding parking lot and aditional service duplicate"
        });
    }
}

const list = (req, res) => {
    ParkingLotAditionalService.find().populate("parkingLot aditionalService").sort('_id').then(parkingLotsAditionalServices => {
        if (!parkingLotsAditionalServices) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots and aditional services avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLotsAditionalServices
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByParkingLotId = (req, res) => {
    let parkingLotId = req.query.idParkingLot;

    ParkingLotAditionalService.find({ parkingLot: parkingLotId }).populate("parkingLot aditionalService").sort('_id').then(parkingLotsAditionalServices => {
        if (!parkingLotsAditionalServices) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots and aditional services avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLotsAditionalServices
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByAditionalServiceId = (req, res) => {
    let aditionalServiceId = req.query.idAditionalService;

    ParkingLotAditionalService.find({ aditionalService: aditionalServiceId }).populate("parkingLot aditionalService").sort('_id').then(parkingLotsAditionalServices => {
        if (!parkingLotsAditionalServices) {
            return res.status(404).json({
                status: "Error",
                message: "No parking lots and aditional services avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            parkingLotsAditionalServices
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const editParkingLotAditionalService = (req, res) => {
    let id = req.query.idParkingLotAditionalService;

    ParkingLotAditionalService.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(parkingLotAditionalServiceUpdated => {
        if (!parkingLotAditionalServiceUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Parking Lot and Aditional Service not found"
            })
        }
        return res.status(200).send({
            status: "success",
            parkingLotAditionalService: parkingLotAditionalServiceUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating parking Lot and aditional service"
        })
    })
}

module.exports = {
    create,
    list,
    getByParkingLotId,
    getByAditionalServiceId,
    editParkingLotAditionalService
}