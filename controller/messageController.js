const Message = require("../models/MessageModel");

const sendToOwner = async (req, res) => {
    let body = req.body;
    let driverId = req.user.id;
    let ownerId = req.query.idOwner;

    if (!body.message) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyMessage = {
        driver: driverId,
        owner: ownerId,
        message: body.message,
        senderReceiver: "DO"
    }

    let message_to_save = new Message(bodyMessage);

    try {
        const messageStored = await message_to_save.save();

        if (!messageStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No booking saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            messageStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving message",
            error
        });
    }
}

const sendToDriver = async (req, res) => {
    let body = req.body;
    let ownerId = req.user.id;
    let driverId = req.query.idDriver;

    if (!body.message) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    let bodyMessage = {
        driver: driverId,
        owner: ownerId,
        message: body.message,
        senderReceiver: "OD"
    }

    let message_to_save = new Message(bodyMessage);

    try {
        const messageStored = await message_to_save.save();

        if (!messageStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No booking saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            messageStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving message",
            error
        });
    }
}

const getConversationByDriverIdAndMarkAsRead = async (req, res) => {
    let driverId = req.user.id;
    let ownerId = req.query.idOwner;

    await Message.updateMany(
        { $and: [{ driver: driverId }, { owner: ownerId }, { seen: false }] },
        { $set: { seen: true } }
    );

    Message.find({ $and: [{ driver: driverId }, { owner: ownerId }] }).populate("driver owner", "name -_id").sort('date').then(messages => {
        if (!messages) {
            return res.status(404).json({
                status: "Error",
                message: "No messages avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            messages
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getConversationByOwnerIdAndMarkAsRead = async (req, res) => {
    let ownerId = req.user.id;
    let driverId = req.query.idDriver;

    await Message.updateMany(
        { $and: [{ driver: driverId }, { owner: ownerId }, { seen: false }] },
        { $set: { seen: true } }
    );

    Message.find({ $and: [{ driver: driverId }, { owner: ownerId }] }).populate("driver owner", "name -_id").sort('date').then(messages => {
        if (!messages) {
            return res.status(404).json({
                status: "Error",
                message: "No messages avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            messages
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllConversationsFromDriverToken = (req, res) => {
    let driverId = req.user.id;

    Message.distinct("owner", { driver: driverId }).then(messagesFromOwners => {
        if (!messagesFromOwners) {
            return res.status(404).json({
                status: "Error",
                message: "No messages avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            messagesFromOwners
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const getAllConversationsFromOwnerToken = (req, res) => {
    let ownerId = req.user.id;

    Message.distinct("driver", { owner: ownerId }).then(messagesFromDrivers => {
        if (!messagesFromDrivers) {
            return res.status(404).json({
                status: "Error",
                message: "No messages avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            messagesFromDrivers
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    sendToDriver,
    sendToOwner,
    getConversationByDriverIdAndMarkAsRead,
    getConversationByOwnerIdAndMarkAsRead,
    getAllConversationsFromDriverToken,
    getAllConversationsFromOwnerToken
}