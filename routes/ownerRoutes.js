const express = require("express");
const router = express.Router();
const OwnerController = require("../controller/ownerController");
const check = require("../middlewares/auth");

router.post("/register", OwnerController.register);
router.post("/login", OwnerController.login);
router.get("/", check.auth, OwnerController.profile);

module.exports = router;