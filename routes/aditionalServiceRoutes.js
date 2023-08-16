const express = require("express");
const router = express.Router();
const AditionalServiceController = require("../controller/aditionalServiceController");

router.get("/list", AditionalServiceController.list);
router.get("/", AditionalServiceController.getById);
router.post("/", AditionalServiceController.create);
router.put("/", AditionalServiceController.editAditionalService);

module.exports = router;