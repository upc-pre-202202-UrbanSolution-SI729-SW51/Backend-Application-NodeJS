const express = require("express");
const router = express.Router();
const BookingController = require("../controller/bookingController");
const check = require("../middlewares/auth");

router.get("/list", check.auth, BookingController.list);
router.get("/myList", check.auth, BookingController.myList);
router.post("/", check.auth, BookingController.create);
router.delete("/:id", check.auth, BookingController.deleteBooking);
router.put("/:id", BookingController.editBooking);
//Endpoits for flutter mobile app v1
router.get("/parkingLot/:idParkingLot", BookingController.getByParkingLotId);

module.exports = router;