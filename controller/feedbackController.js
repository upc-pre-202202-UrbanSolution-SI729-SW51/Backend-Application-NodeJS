const Feedback = require("../models/FeedbackModel");

const create = async (req, res) => {
    let body = req.body;
    let driverId = req.user.id;
    let parkingLotId = req.query.idParkingLot;

    if (!body.comment || !body.stars) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyFeedback = {
        driver: driverId,
        parkingLot: parkingLotId,
        comment: body.comment,
        stars: body.stars
    }

    let feedback_to_save = new Feedback(bodyFeedback);

    try {
        const feedbackStored = await feedback_to_save.save();

        if (!feedbackStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No feedback saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Feedback registered",
            "feedback": feedbackStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving feedback",
            error
        });
    }
}

const getById = (req, res) => {
    Feedback.findById(req.query.idFeedback).then(feedback => {
        if (!feedback) {
            return res.status(404).json({
                "status": "error",
                "message": "Feedback doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "feedback": feedback
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding feedback"
        });
    });
}

const editFeedback = (req, res) => {
    let id = req.query.idFeedback;

    Feedback.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(feedbackUpdated => {
        if (!feedbackUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Feedback not found"
            })
        }
        return res.status(200).send({
            status: "success",
            feedback: feedbackUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating feedback"
        })
    })
}

const deleteFeedback = (req, res) => {
    let id = req.query.idFeedback;

    Feedback.findOneAndDelete({ _id: id }).then(deletedFeedback => {
        if (!deletedFeedback) {
            return res.status(404).json({
                status: "error",
                mensaje: "Feedback not found"
            })
        }
        return res.status(200).send({
            status: "success",
            feedback: deletedFeedback
        });
    }
    ).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and deleting feedback"
        })
    });
}

const getByParkingLotId = (req, res) => {
    let parkingLotId = req.query.idParkingLot;

    Feedback.find({ parkingLot: parkingLotId }).sort('_id').then(feedbacks => {
        if (!feedbacks) {
            return res.status(404).json({
                status: "Error",
                message: "No feedbacks avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            feedbacks
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getByDriverId = (req, res) => {
    let driverId = req.query.idDriver;

    Feedback.find({ driver: driverId }).sort('_id').then(feedbacks => {
        if (!feedbacks) {
            return res.status(404).json({
                status: "Error",
                message: "No feedbacks avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            feedbacks
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAverageStarsByParkingId = (req, res) => {
    let parkingLotIdId = req.query.idParkingLot;

    Feedback.find({ parkingLot: parkingLotIdId }).sort('_id').then(feedbacks => {
        if (!feedbacks) {
            return res.status(404).json({
                status: "Error",
                message: "No feedbacks avaliable..."
            });
        }

        let totalStars = 0;
        for (let feedback of feedbacks) {
            totalStars += feedback.stars;
        }

        const averageStars = totalStars / feedbacks.length;

        return res.status(200).json({
            "status": "success",
            averageStars: averageStars.toFixed(2)
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    getById,
    create,
    editFeedback,
    deleteFeedback,
    getByParkingLotId,
    getByDriverId,
    getAverageStarsByParkingId
}