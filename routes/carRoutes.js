const express = require("express");
const router = express.Router();
const CarController = require("../controller/carController");
const check = require("../middlewares/auth");

router.get("/list", CarController.list);
router.get("/myList", check.auth, CarController.myList);
router.post("/", check.auth, CarController.create);
router.get("/", CarController.carById);

module.exports = router;