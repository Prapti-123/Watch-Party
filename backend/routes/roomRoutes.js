const express = require("express");
const router = express.Router();

// Create Room
const { createRoom } = require("../controller/roomController");
router.post("/", createRoom);

// Join Room
const { joinRoom } = require("../controller/roomController");
// POST /api/rooms/join
router.post("/join", joinRoom);


// Get Room
const { getRoom } = require("../controller/roomController");
// GET /api/rooms/:roomId
router.get("/:roomId", getRoom);

// Leave Room
const { leaveRoom } = require("../controller/roomController");
router.post("/leave", leaveRoom);


module.exports = router;