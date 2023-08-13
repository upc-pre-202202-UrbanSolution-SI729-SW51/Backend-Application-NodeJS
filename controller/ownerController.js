const Owner = require("../models/OwnerModel");
const ParkingLot = require("../models/ParkingLotModel");
const bcrypt = require("bcrypt");

const jwt = require("../services/jwt");

const register = async (req, res) => {
    let body = req.body;
    let owner = new Owner();

    if (!body.name || !body.lastName || !body.email || !body.password || !body.idType || !body.idNumber
        || !body.parkingName || !body.location || !body.hoursOfAttention || !body.costHours || !body.accept4x4Truck) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyUser = {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        password: body.password,
        idType: body.idType,
        idNumber: body.idNumber
    }

    let bodyParkingLot = {
        parkingName: body.parkingName,
        location: body.location,
        hoursOfAttention: body.hoursOfAttention,
        costHours: body.costHours,
        accept4x4Truck: body.accept4x4Truck,
        owner: 0
    }

    try {
        const owners = await Owner.find({ $or: [{ email: bodyUser.email.toLowerCase() }] });

        if (owners && owners.length >= 1) {
            return res.status(200).json({
                "status": "success",
                "message": "The owner already exists"
            });
        }

        let pwd = await bcrypt.hash(bodyUser.password, 10);
        bodyUser.password = pwd;

        let owner_to_save = new Owner(bodyUser);

        try {
            const ownerStored = await owner_to_save.save();

            if (!ownerStored) {
                return res.status(500).json({
                    "status": "error",
                    "message": "Error while saving owner"
                });
            }

            bodyParkingLot.owner = ownerStored._id;

            owner = ownerStored;

        } catch {
            return res.status(500).json({
                "status": "error",
                "message": "Error while saving owner"
            });
        }
    } catch {
        return res.status(500).json({
            "status": "error",
            "message": "Error while finding owner duplicate"
        });
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
            "message": "Error while finding parking lot duplicate"
        });
    }
}

const login = (req, res) => {
    const body = req.body;

    if (!body.email || !body.password) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    Owner.findOne({ email: body.email }).then(owner => {
        if (!owner) {
            return res.status(400).json({
                "status": "error",
                "message": "owner doesn't exist"
            });
        }

        let pwd = bcrypt.compareSync(body.password, owner.password);

        if (!pwd) {
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

    }).catch(() => {
        return res.status(400).json({
            "status": "error",
            "message": "Error while finding owner"
        });
    });
}

const profile = (req, res) => {
    Owner.findById(req.user.id).select({ password: 0 }).then(owner => {
        if (!owner) {
            return res.status(404).json({
                "status": "error",
                "message": "Owner doesn't exist"
            });
        }

        return res.status(200).json({
            "status": "success",
            "owner": owner
        });
    }).catch(() => {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding driver"
        });
    });
}

module.exports = {
    register,
    login,
    profile
}