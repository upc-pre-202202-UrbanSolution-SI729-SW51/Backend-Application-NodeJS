const express = require("express");
const router = express.Router();
const FeedbackController = require("../controller/feedbackController");
const check = require("../middlewares/auth");

router.post("/", check.auth, FeedbackController.create);
router.get("/", FeedbackController.getById);
router.put("/", FeedbackController.editFeedback);
router.delete("/", FeedbackController.deleteFeedback);
router.get("/parkingLot", FeedbackController.getByParkingLotId);
router.get("/driver", FeedbackController.getByDriverId);
router.get("/stars", FeedbackController.getAverageStarsByParkingId);

module.exports = router;