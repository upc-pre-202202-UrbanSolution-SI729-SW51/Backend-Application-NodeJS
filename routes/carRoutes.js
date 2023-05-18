const express = require("express");
const router = express.Router();
const CarController = require("../controller/carController");
const check = require("../middlewares/auth");

router.get("/list", check.auth, CarController.list);
router.post("/", check.auth, CarController.create);
router.get("/:id", check.auth, CarController.carById);

module.exports = router;