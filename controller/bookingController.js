const Booking = require("../models/BookingModel");
const Car = require("../models/CarModel");
const ParkingLot = require("../models/ParkingLotModel");

const list = (req, res) => {
    Booking.find().populate("driver car parkingLot", "name brand model parkingName costHours").sort('_id').then(bookings => {
        if (!bookings) {
            return res.status(404).json({
                status: "Error",
                message: "No bookings avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            bookings
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const myList = (req, res) => {
    let driverId = req.user.id;

    Booking.find({ driver: driverId }).populate("driver car parkingLot", "name brand model parkingName costHours -_id").sort('_id').then(bookings => {
        if (!bookings) {
            return res.status(404).json({
                status: "Error",
                message: "No bookings avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            bookings
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

const create = async (req, res) => {
    let body = req.body;
    let driverId = req.user.id;
    let carId = req.user.id;
    let parkingLotId = req.user.id;

    if (!body.car || !body.parkingLot) {
        return res.status(400).json({
            "status": "error",
            "message": "Missing data"
        });
    }

    try {
        const car = await Car.findById(body.car);

        if (!car) {
            return res.status(404).json({
                "status": "error",
                "message": "Car doesn't exist"
            });
        }

        carId = car.id;
    } catch {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding car in booking endpoint post"
        });
    }

    try {
        const parkingLot = await ParkingLot.findById(body.parkingLot);

        if (!parkingLot) {
            return res.status(404).json({
                "status": "error",
                "message": "Parking lot doesn't exist"
            });
        }

        parkingLotId = parkingLot.id
    } catch {
        return res.status(404).json({
            "status": "error",
            "message": "Error while finding parking lot in booking endpoint post"
        });
    }

    let bodyBooking = {
        driver: driverId,
        car: carId,
        parkingLot: parkingLotId,
        status: "Booked"
    }

    let bookings_to_save = new Booking(bodyBooking);

    try {
        const bookingStored = await bookings_to_save.save();

        if (!bookingStored) {
            return res.status(500).json({
                "status": "error",
                "message": "No booking saved"
            });
        }

        return res.status(200).json({
            "status": "success",
            "message": "Booking registered",
            "bookings": bookingStored
        });
    } catch (error) {
        return res.status(500).json({
            "status": "error",
            "message": "Error while saving booking",
            error
        });
    }
}

const deleteBooking = (req, res) => {
    let id = req.query.idBooking;

    Booking.findOneAndDelete({ _id: id }).then(deletedBooking => {
        if (!deletedBooking) {
            return res.status(404).json({
                status: "error",
                mensaje: "Booking not found"
            })
        }
        return res.status(200).send({
            status: "success",
            booking: deletedBooking
        });
    }
    ).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and deleting booking"
        })
    });
}

const editBooking = (req, res) => {
    let id = req.query.idBooking;

    Booking.findOneAndUpdate({ _id: id }, req.body, { new: true }).then(bookingUpdated => {
        if (!bookingUpdated) {
            return res.status(404).json({
                status: "error",
                mensaje: "Booking not found"
            })
        }
        return res.status(200).send({
            status: "success",
            booking: bookingUpdated
        });
    }).catch(() => {
        return res.status(404).json({
            status: "error",
            mensaje: "Error while finding and updating booking"
        })
    })
}

const getByParkingLotId = (req, res) => {
    let parkingLotId = req.query.idParkingLot;

    Booking.find({ parkingLot: parkingLotId }).populate("driver car parkingLot", "name brand model parkingName costHours -_id").sort('_id').then(bookings => {
        if (!bookings) {
            return res.status(404).json({
                status: "Error",
                message: "No bookings avaliable..."
            });
        }

        return res.status(200).json({
            "status": "success",
            bookings
        });
    }).catch(error => {
        return res.status(500).json({
            "status": "error",
            error
        });
    });
}

module.exports = {
    list,
    myList,
    create,
    deleteBooking,
    editBooking,
    getByParkingLotId
}