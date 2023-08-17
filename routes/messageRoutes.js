const express = require("express");
const router = express.Router();
const MessageController = require("../controller/messageController");
const check = require("../middlewares/auth");

router.post("/toDriver", check.auth, MessageController.sendToDriver);
router.post("/toOwner", check.auth, MessageController.sendToOwner);
router.get("/conversationWithOwner", check.auth, MessageController.getConversationByDriverIdAndMarkAsRead);
router.get("/conversationWithDriver", check.auth, MessageController.getConversationByOwnerIdAndMarkAsRead);
router.get("/driverConversations", check.auth, MessageController.getAllConversationsFromDriverToken);
router.get("/ownerConversations", check.auth, MessageController.getAllConversationsFromOwnerToken);

module.exports = router;