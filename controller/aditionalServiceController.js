const AditionalService = require("../models/AditionalServiceModel");

const list = (req, res) => {
    AditionalService.find().sort('_id').then(aditionalServices => {
        if (!aditionalServices) {
            return res.status(404).json({
                status: "Error",
                message: "No aditional services avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            aditionalServices
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getById = (req, res) => {
    AditionalService.findById(req.query.idAditionalService).then(aditionalService => {
        if (!aditionalService) {
            return res.status(404).json({
                "status": "error",
                "message": "Aditional Service doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "aditionalService": aditionalService
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding aditional service"
        });
    });
}

const create = async (req, res) => {
    let body = req.body;

    let bodyAditionalService = {
        name: body.name,
        description: body.description
    }

    let aditionalService_to_save = new AditionalService(bodyAditionalService);

    try {
        const aditionalServiceStored = await aditionalService_to_save.save();

        if (!aditionalServiceStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No aditional service saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Aditional service registered",
            "aditionalService": aditionalServiceStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving aditional service",
            error
        });
    }
}

const editAditionalService = (req, res) => {
    let id = req.query.idAditionalService;

    AditionalService.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(aditionalServiceUpdated => {
        if (!aditionalServiceUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Aditional Service not found"
            })
        }
        return res.status(200).send({
            status: "success",
            aditionalService: aditionalServiceUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating aditional service"
        })
    })
}

module.exports = {
    list,
    getById,
    create,
    editAditionalService
}