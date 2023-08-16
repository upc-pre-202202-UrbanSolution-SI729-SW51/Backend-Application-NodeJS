const express = require("express");
const router = express.Router();
const ParkingLotAditionalServiceController = require("../controller/parkingLotAditionalServiceController");

router.post("/", ParkingLotAditionalServiceController.create);
router.get("/list", ParkingLotAditionalServiceController.list);
router.get("/parkingLot", ParkingLotAditionalServiceController.getByParkingLotId);
router.get("/aditionalService", ParkingLotAditionalServiceController.getByAditionalServiceId);
router.put("/", ParkingLotAditionalServiceController.editParkingLotAditionalService);

module.exports = router;