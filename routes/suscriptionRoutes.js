const express = require("express");
const router = express.Router();
const SuscriptionController = require("../controller/suscriptionController");
const check = require("../middlewares/auth");

router.post("/", check.auth, SuscriptionController.create);
router.get("/list", SuscriptionController.list);
router.get("/", SuscriptionController.suscriptionById);
router.get("/driver", check.auth, SuscriptionController.mySuscriptionsByDriverToken);
router.get("/parkingLot", check.auth, SuscriptionController.getAllByParkingLotId);

module.exports = router;