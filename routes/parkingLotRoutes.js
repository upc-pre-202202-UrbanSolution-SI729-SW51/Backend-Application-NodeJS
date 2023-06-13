const express = require("express");
const router = express.Router();
const ParkingLotController = require("../controller/parkingLotController");
const check = require("../middlewares/auth");

router.get("/list", check.auth, ParkingLotController.list);
router.post("/", check.auth, ParkingLotController.create);
router.put("/:id", ParkingLotController.editParkingLot);
router.get("/:id", check.auth, ParkingLotController.parkingLotById);

//Endpoits for flutter mobile app v1
router.get("/owner/:id", ParkingLotController.listFromOwner);
router.post("/:idOwner", ParkingLotController.createByOwnerId);
//Endpoits without auth for flutter mobile app v1 (return auth when finished)
router.delete("/:id", ParkingLotController.deleteParkingLot);

module.exports = router;