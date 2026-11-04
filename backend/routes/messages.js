
const express = require("express");
const router = express.Router();

const {
    sendMessage,
    revealMessage,
    submitResponse,
    getResponses,
    getResponseByCode
} = require("../controllers/messageController");

// Import middleware
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// SENDER PORTAL
router.post("/send", protect, upload.array("images", 5), sendMessage);
router.get("/responses", protect, getResponses);

// RECEIVER PORTAL
router.post("/reveal", revealMessage);
router.post("/respond", submitResponse);

// RESPOND PORTAL
router.post("/response-by-code", getResponseByCode);

module.exports = router;
