const Owner = require("../models/ownerModel");
const ParkingLot = require("../models/ParkingLotModel");
const bcrypt = require("bcrypt");

const jwt = require("../services/jwt");

const ownerTest = (req, res) => {
    return res.status(200).json({
        "message": "Message sent from controller/ownerController.js"
    });
}

const register = async(req, res) => {
    let params = req.body;
    let owner = new Owner();

    if(!params.name || !params.lastName || !params.email || !params.password || !params.idType || !params.idNumber
        || !params.parkingName || !params.location || !params.hoursOfAttention || !params.costHours || !params.accept4x4Truck){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let paramsUser = {
        name: params.name,
        lastName: params.lastName,
        email: params.email,
        password: params.password,
        idType: params.idType,
        idNumber: params.idNumber
    }

    let paramsParkingLot = {
        parkingName: params.parkingName,
        location: params.location,
        hoursOfAttention: params.hoursOfAttention,
        costHours: params.costHours,
        accept4x4Truck: params.accept4x4Truck,
        owner: 0
    }

    try {
        const owners = await Owner.find({ $or: [{email: paramsUser.email.toLowerCase()}]});

        if (owners && owners.length >= 1){
            return res.status(200).json({
                "status": "success",
                "message": "The owner already exists"
            });
        }

        let pwd = await bcrypt.hash(paramsUser.password, 10);
        paramsUser.password = pwd;

        let owner_to_save = new Owner(paramsUser);

        try {
            const ownerStored = await owner_to_save.save();
    
            if(!ownerStored){
                return res.status(500).json({
                    "status": "error",
                    "message": "Error while saving owner"
                });
            }

            paramsParkingLot.owner = ownerStored._id;

            owner=ownerStored;

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving owner"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error finding if user already exists"
        });
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
                "message": "Owner and Parking Lot registered",
                "owner": owner,
                "parkingLot": parkingLotStored
            });
        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving parking lot"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding parking lot"
        });
    }
}

const login = (req, res) => {
    const params = req.body;

    if(!params.email || !params.password){
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    Owner.findOne({email: params.email}).then( owner =>{
        if(!owner){
            return res.status(400).json({
                "status": "error",
                "message": "owner doesn't exist"
            });
        }

        let pwd = bcrypt.compareSync(params.password, owner.password);

        if(!pwd){
            return res.status(400).json({
                "status": "error",
                "message": "Passwords doesn't match"
            });
        }

        const token = jwt.createToken(owner);

        return res.status(200).json({
            "status": "success",
            "message": "You have identified correctly",
            owner: {
                id: owner._id,
                name: owner.name,
                lastName: owner.lastName
            },
            token
        });

    }).catch( error => {
        return res.status(400).json({
            "status": "error",
            "message": "owner doesn't exist"
        });
    });
}

const profile = (req, res) => {
    Owner.findById(req.user.id).select({password: 0}).then(owner => {
        if(!owner){
            return res.status(404).json({
                "status": "error",
                "message": "owner doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "owner": owner
        });
    }).catch( () => {
        return res.status(404).json({
            "status": "error",
            "message": "owner doesn't exist"
        });
    });
}

module.exports = {
    ownerTest,
    register,
    login,
    profile
}