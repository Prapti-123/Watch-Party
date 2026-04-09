// src/controllers/roomController.js

const {
  createRoomService,
  joinRoomService,
  getRoomService,
  leaveRoomService,
} = require("../services/roomService");

// ✅ CREATE ROOM
const createRoom = async (req, res) => {
  try {
    const { hostId } = req.body;

    const room = await createRoomService(hostId);

    res.json(room);
  } 
  catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create room",
    });
  }
};

// ✅ JOIN ROOM
const joinRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    // 1️⃣ Validation
    if (!roomId || !userId) {
      return res.status(400).json({
        message: "roomId and userId are required",
      });
    }

    // 2️⃣ Service call
    const result = await joinRoomService(roomId, userId);

    // 3️⃣ Success response
    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("JOIN ROOM ERROR:", error);

    // 4️⃣ Custom errors from service
    if (error.message === "ROOM_NOT_FOUND") {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(400).json({
        message: "User already in room",
      });
    }

    // 5️⃣ Fallback error
    return res.status(500).json({
      message: "Failed to join room",
    });
  }
};

// ✅ GET ROOM

const getRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // 1️⃣ validation
    if (!roomId) {
      return res.status(400).json({
        message: "roomId is required",
      });
    }

    // 2️⃣ service call
    const result = await getRoomService(roomId);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error(error);

   
    return res.status(500).json({
      message: "Failed to fetch room",
    });
  }
};

// ✅ LEAVE ROOM
// ✅ LEAVE ROOM
const leaveRoom = async (req, res) => {
  try {
    const { roomId, userId } = req.body;

    // validation
    if (!roomId || !userId) {
      return res.status(400).json({
        message: "roomId and userId are required",
      });
    }

    const result = await leaveRoomService(roomId, userId);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("LEAVE ROOM ERROR:", error);

    if (error.message === "ROOM_NOT_FOUND") {
      return res.status(404).json({ message: "Room not found" });
    }

    if (error.message === "USER_NOT_IN_ROOM") {
      return res.status(400).json({ message: "User not in room" });
    }

    return res.status(500).json({
      message: "Failed to leave room",
    });
  }
};

module.exports = {
  createRoom,
  joinRoom,
  getRoom,
  leaveRoom,
};