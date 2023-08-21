const express = require("express");
const router = express.Router();
const SuscriptionRequestController = require("../controller/suscriptionRequestController");
const check = require("../middlewares/auth");

router.post("/", check.auth, SuscriptionRequestController.create);
router.get("/list", SuscriptionRequestController.list);
router.get("/", SuscriptionRequestController.suscriptionRequestById);
router.get("/driver", check.auth, SuscriptionRequestController.mySuscriptionRequestsByDriverToken);
router.get("/parkingLot", check.auth, SuscriptionRequestController.getAllByParkingLotId);
router.put("/", SuscriptionRequestController.editSuscriptionRequest);

module.exports = router;