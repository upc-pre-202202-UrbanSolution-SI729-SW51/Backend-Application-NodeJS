const express = require("express");
const router = express.Router();
const BookingController = require("../controller/bookingController");
const check = require("../middlewares/auth");

router.get("/list", BookingController.list);
router.get("/myList", check.auth, BookingController.myList);
router.post("/", check.auth, BookingController.create);
router.delete("/", BookingController.deleteBooking);
router.put("/", BookingController.editBooking);
router.get("/parkingLot", BookingController.getByParkingLotId);

module.exports = router;