const SuscriptionRequest = require("../models/suscriptionRequestModel");

const create = async (req, res) => {
    let driverId = req.user.id;
    let parkingLotId = req.query.idParkingLot;

    let bodySuscriptionRequest = {
        driver: driverId,
        parkingLot: parkingLotId,
        message: body.message,
        timeRequested: body.timeRequested,
        status: body.status,
        date: body.date,
        ownerAnswer: body.ownerAnswer,
    }

    let suscription_request_to_save = new SuscriptionRequest(bodySuscriptionRequest);

    try {
        const suscriptionRequestStored = await suscription_request_to_save.save();

        if (!suscriptionRequestStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No suscription request saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Suscription request registered",
            "suscriptionRequest": suscriptionRequestStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving suscriptionRequest",
            error
        });
    }
}

const list = (req, res) => {
    SuscriptionRequest.find().populate("driver parkingLot").sort('_id').then(suscriptionRequests => {
        if (!suscriptionRequests) {
            return res.status(404).json({
                status: "Error",
                message: "No suscriptionRequests avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptionRequests
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const suscriptionRequestById = (req, res) => {
    SuscriptionRequest.findById(req.query.idSuscriptionRequest).then(suscriptionRequest => {
        if (!suscriptionRequest) {
            return res.status(404).json({
                "status": "error",
                "message": "Suscription request doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "suscriptionRequest": suscriptionRequest
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding suscription request"
        });
    });
}

const mySuscriptionRequestsByDriverToken = (req, res) => {
    let driverId = req.user.id;

    SuscriptionRequest.find({ driver: driverId }).populate("driver parkingLot").sort('_id').then(suscriptionRequests => {
        if (!suscriptionRequests) {
            return res.status(404).json({
                status: "Error",
                message: "No suscription requests avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptionRequests
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

    SuscriptionRequest.find({ parkingLot: parkingLotId }).populate("driver parkingLot").sort('_id').then(suscriptionRequests => {
        if (!suscriptionRequests) {
            return res.status(404).json({
                status: "Error",
                message: "No suscription requests avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            suscriptionRequests
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const editSuscriptionRequest = (req, res) => {
    let id = req.query.idSuscriptionRequest;

    SuscriptionRequest.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(suscriptionRequestUpdated => {
        if (!suscriptionRequestUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Suscription request not found"
            })
        }
        return res.status(200).send({
            status: "success",
            suscriptionRequest: suscriptionRequestUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating suscription request"
        })
    })
}

module.exports = {
    create,
    list,
    suscriptionRequestById,
    mySuscriptionRequestsByDriverToken,
    getAllByParkingLotId,
    editSuscriptionRequest
}