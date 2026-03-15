const express = require("express");
const router = express.Router();
const { searchYouTube } = require("../controller/youtubeController");
router.get("/search", searchYouTube);

module.exports = router;