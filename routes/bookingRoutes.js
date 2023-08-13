const express = require("express");
const router = express.Router();
const BookingController = require("../controller/bookingController");
const check = require("../middlewares/auth");

router.get("/list", BookingController.list);
router.get("/myList", check.auth, BookingController.myList);
router.post("/", check.auth, BookingController.create);
router.delete("/:id", BookingController.deleteBooking);
router.put("/:id", BookingController.editBooking);
router.get("/parkingLot/:idParkingLot", BookingController.getByParkingLotId);

module.exports = router;