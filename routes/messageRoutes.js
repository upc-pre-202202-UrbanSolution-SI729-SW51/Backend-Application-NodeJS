const express = require("express");
const router = express.Router();
const MessageController = require("../controller/messageController");
const check = require("../middlewares/auth");

router.post("/toDriver", check.auth, MessageController.sendToDriver);
router.post("/toOwner", check.auth, MessageController.sendToOwner);
router.get("/conversationWithOwner", check.auth, MessageController.getConversationByDriverId);
router.get("/conversationWithDriver", check.auth, MessageController.getConversationByOwnerId);

module.exports = router;