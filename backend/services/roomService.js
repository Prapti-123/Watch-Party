const Room = require("../models/Room");
const { redisClient } = require("../lib/redis"); // ✅ use this
const { nanoid } = require("nanoid");

// Create Room Service
async function createRoomService(hostId) {
  try {
    const roomId = nanoid(8);

    const room = await Room.create({
      roomId,
      hostId,
        participants: [ {
      userId: hostId,
      username: hostId,   // ya alag username field bhej sakti ho
      role: "host",
      isActive: true
    }]
    });

    await redisClient.set(   
      `room:${roomId}:state`,
      JSON.stringify({
        videoId: null,
        currentTime: 0,
        playing: false
      })
    );

   
    await redisClient.sAdd(
      `room:${roomId}:participants`,
      JSON.stringify({
        userId: hostId,
        username: hostId,
        role: "host"
      })
    );

    return room;

  } catch (error) {
    console.error("Service Error:", error);
    throw error;
  }
}


// Join Room Service
async function joinRoomService(roomId, userId) {
  try {
    // 1️⃣ Room check in DB
    const room = await Room.findOne({ roomId });

    if (!room) {
      throw new Error("ROOM_NOT_FOUND");
    }

    // 2️⃣ Check if already joined
   const alreadyExists = room.participants.some(
  (p) => p.userId === userId
);

if (alreadyExists) {
  throw new Error("USER_ALREADY_EXISTS");
}

    // 3️⃣ Add user to DB
   room.participants.push({
  userId,
  username: userId,   // ya frontend se bhejo
  role: "viewer"
});
    await room.save();

    // 4️⃣ Add user to Redis (SET)
    await redisClient.sAdd(
      `room:${roomId}:participants`,
      JSON.stringify({
        userId: userId,
        username: userId,
        role: "viewer"
      })
    );
    return {
      roomId,
      userId,
      message: "Joined room successfully",
    };

  } catch (error) {
    console.error("JOIN ROOM SERVICE ERROR:", error);
    throw error;
  }
}

//Get Room Service
async function getRoomService(roomId) {
  const participants = await redisClient.sMembers(
    `room:${roomId}:participants`
  );

let stateRaw = await redisClient.get(`room:${roomId}:state`);

const state = stateRaw
  ? JSON.parse(stateRaw)
  : {
      videoId: null,
      currentTime: 0,
      playing: false,
    };

return {
  participants,
  state,
};
}
// Leave Room Service
async function leaveRoomService(roomId, userId) {
  // 1️⃣ DB check
  const room = await Room.findOne({ roomId });

  if (!room) {
    throw new Error("ROOM_NOT_FOUND");
  }

  // 2️⃣ Check user exists
  const exists = room.participants.some(
  (p) => p.userId === userId
);

if (!exists) {
  throw new Error("USER_NOT_IN_ROOM");
}

  // 3️⃣ Remove from DB
 room.participants = room.participants.filter(
  (p) => p.userId !== userId
);
  await room.save();

  // 4️⃣ Remove from Redis
 await redisClient.sRem(
  `room:${roomId}:participants`,
  JSON.stringify({
    userId,
    username: userId,
    role: "viewer"
  })
);
  return {
    roomId,
    userId,
    message: "Left room successfully",
  };
}



module.exports = { createRoomService, joinRoomService, getRoomService, leaveRoomService };