const express = require("express");
const router = express.Router();
const ParkingLotController = require("../controller/parkingLotController");
const check = require("../middlewares/auth");

router.get("/list", ParkingLotController.list);
router.get("/myList", check.auth, ParkingLotController.myList);
router.post("/", check.auth, ParkingLotController.create);
router.put("/", ParkingLotController.editParkingLot);
router.get("/", ParkingLotController.parkingLotById);
router.delete("/", ParkingLotController.deleteParkingLot);

module.exports = router;