const express = require("express");
const router = express.Router();
const DriverController = require("../controller/driverController");
const check = require("../middlewares/auth");

router.get("/driver-test", DriverController.driverTest);

router.post("/register", DriverController.register);
router.post("/login", DriverController.login);
router.get("/", check.auth, DriverController.profile);
router.get("/:id", check.auth, DriverController.driverById);

module.exports = router;