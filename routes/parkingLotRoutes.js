const express = require("express");
const router = express.Router();
const ParkingLotController = require("../controller/parkingLotController");
const check = require("../middlewares/auth");

router.get("/list", check.auth, ParkingLotController.list);
router.post("/", check.auth, ParkingLotController.create);
router.put("/:id", ParkingLotController.editParkingLot);
router.get("/:id", check.auth, ParkingLotController.parkingLotById);
router.delete("/:id", check.auth, ParkingLotController.deleteParkingLot);

module.exports = router;