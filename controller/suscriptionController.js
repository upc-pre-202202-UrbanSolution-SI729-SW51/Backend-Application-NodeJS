const Suscription = require("../models/suscriptionModel");

const create = async (req, res) => {
    let driverId = req.user.id;
    let parkingLotId = req.query.idParkingLot;

    let bodySuscription = {
        parkingLot: parkingLotId,
        driver: driverId,
        startDate: body.startDate,
        finishDate: body.finishDate
    }

    let suscription_to_save = new Suscription(bodySuscription);

    try {
        const suscriptionStored = await suscription_to_save.save();

        if (!suscriptionStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No suscription saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Suscription registered",
            "suscription": suscriptionStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving suscription",
            error
        });
    }
}

const list = (req, res) => {
    Suscription.find().populate("driver parkingLot").sort('_id').then(suscriptions => {
        if (!suscriptions) {
            return res.status(404).json({
                status: "Error",
                message: "No suscriptions avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptions
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const suscriptionById = (req, res) => {
    Suscription.findById(req.query.idSuscription).then(suscription => {
        if (!suscription) {
            return res.status(404).json({
                "status": "error",
                "message": "Suscription doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "suscription": suscription
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding suscription"
        });
    });
}

const mySuscriptionsByDriverToken = (req, res) => {
    let driverId = req.user.id;

    Suscription.find({ driver: driverId }).populate("driver parkingLot").sort('_id').then(suscriptions => {
        if (!suscriptions) {
            return res.status(404).json({
                status: "Error",
                message: "No suscriptions avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptions
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllByParkingLotId = (req, res) => {
    let parkingLotId = req.query.idParkingLot;

    Suscription.find({ parkingLot: parkingLotId }).populate("driver parkingLot").sort('_id').then(suscriptions => {
        if (!suscriptions) {
            return res.status(404).json({
                status: "Error",
                message: "No suscriptions avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptions
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    create,
    list,
    suscriptionById,
    mySuscriptionsByDriverToken,
    getAllByParkingLotId
}