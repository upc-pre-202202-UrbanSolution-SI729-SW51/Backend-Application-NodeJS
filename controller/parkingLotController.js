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

module.exports = {
    list
}