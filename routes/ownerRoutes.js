const express = require("express");
const router = express.Router();
const OwnerController = require("../controller/ownerController");
const check = require("../middlewares/auth");

router.get("/owner-test", OwnerController.ownerTest);

router.post("/register", OwnerController.register);
router.post("/login", OwnerController.login);
router.get("/", check.auth, OwnerController.profile);
//Endpoits for flutter mobile app v1
router.get("/list", OwnerController.list);
router.get("/:id", OwnerController.getById);

module.exports = router;