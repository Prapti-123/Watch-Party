// sockets/socketHandler.js

const { redisClient } = require("../lib/redis");
const isHost = require("../utils/isHost");
const Room = require("../models/Room");

// ─── helper: clean up a user leaving a room ────────────────────────────────
async function handleLeave(socket, roomId, userId, username) {
  if (!roomId || !userId) return;

  // 1️⃣ Leave socket.io room
  socket.leave(roomId);

  // 2️⃣ Mark participant inactive in MongoDB
  try {
    await Room.findOneAndUpdate(
      { roomId, "participants.userId": userId },
      { $set: { "participants.$.isActive": false } }
    );
  } catch (err) {
    console.error(`[leave] DB update failed for ${userId}:`, err.message);
  }

  // 3️⃣ Broadcast user_left to remaining room members
  socket.to(roomId).emit("user_left", { userId, username });

  // 4️⃣ If room is now empty, delete Redis state to avoid stale memory
  try {
    const socketsInRoom = await socket.in(roomId).fetchSockets();
    if (socketsInRoom.length === 0) {
      await redisClient.del(`room:${roomId}:state`);
      console.log(`[leave] Room ${roomId} is empty — Redis state cleaned`);
    }
  } catch (err) {
    console.error(`[leave] Redis cleanup failed:`, err.message);
  }

  // 5️⃣ Clear socket-level data
  socket.userId = null;
  socket.username = null;
  socket.roomId = null;
}

// ─── main handler ──────────────────────────────────────────────────────────
const handleSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id);

    // ── join_room ────────────────────────────────────────────────────────
    socket.on("join_room", async ({ roomId, userId, username }) => {
      try {
        // Input validation
        if (!roomId || !userId || !username) {
          socket.emit("error", { message: "roomId, userId and username are required for join_room" });
          return;
        }

        // Join socket.io room
        socket.join(roomId);

        // Store on socket for use in other handlers
        socket.userId   = userId;
        socket.username = username;
        socket.roomId   = roomId;

        console.log(`[join_room] ${username} (${userId}) joined ${roomId}`);

        // Notify everyone else immediately after joining the socket room
        socket.to(roomId).emit("user_joined", { userId, username });

        // Upsert participant in MongoDB: if already there set isActive=true, else push
        const room = await Room.findOne({ roomId });
        if (!room) {
          socket.emit("error", { message: "Room not found" });
          return;
        }

        const existingIdx = room.participants.findIndex((p) => p.userId === userId);
        if (existingIdx !== -1) {
          // Re-joining: mark them active again
          room.participants[existingIdx].isActive = true;
        } else {
          // New participant (viewer — host is set at room creation via REST)
          room.participants.push({ userId, username, role: "viewer", isActive: true });
        }
        await room.save();

        // Fetch current Redis state and sync to the joining user
        const stateRaw = await redisClient.get(`room:${roomId}:state`);
        if (stateRaw) {
          socket.emit("sync_state", JSON.parse(stateRaw));
        }

      } catch (err) {
        console.error("[join_room] error:", err.message);
        socket.emit("error", { message: "Failed to join room" });
      }
    });


    // ── play ─────────────────────────────────────────────────────────────
    socket.on("play", async ({ roomId, currentTime }) => {
      try {
        // Guard: must have joined a room first
        if (!socket.userId) {
          socket.emit("error", { message: "Emit join_room before play" });
          return;
        }

        if (!(await isHost(roomId, socket.userId))) {
          socket.emit("error", { message: "[play] Forbidden: you are not the host or room does not exist in DB" });
          return;
        }

        // Update Redis THEN emit — single emit, after state is saved ✅
        const state = JSON.parse(
          (await redisClient.get(`room:${roomId}:state`)) || "{}"
        );
        state.isPlaying  = true;
        state.currentTime = currentTime;
        await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

        socket.to(roomId).emit("play", { currentTime });

      } catch (err) {
        console.error("[play] error:", err.message);
        socket.emit("error", { message: "Server error during play" });
      }
    });


    // ── pause ────────────────────────────────────────────────────────────
    socket.on("pause", async ({ roomId, currentTime }) => {
      try {
        if (!socket.userId) {
          socket.emit("error", { message: "Emit join_room before pause" });
          return;
        }

        if (!(await isHost(roomId, socket.userId))) {
          socket.emit("error", { message: "[pause] Forbidden: you are not the host or room does not exist in DB" });
          return;
        }

        // Update Redis THEN emit — removed the duplicate premature emit ✅
        const state = JSON.parse(
          (await redisClient.get(`room:${roomId}:state`)) || "{}"
        );
        state.isPlaying   = false;
        state.currentTime = currentTime;
        await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

        socket.to(roomId).emit("pause", { currentTime });

      } catch (err) {
        console.error("[pause] error:", err.message);
        socket.emit("error", { message: "Server error during pause" });
      }
    });


    // ── seek ─────────────────────────────────────────────────────────────
    socket.on("seek", async ({ roomId, time }) => {
      try {
        if (!socket.userId) {
          socket.emit("error", { message: "Emit join_room before seek" });
          return;
        }

        if (!(await isHost(roomId, socket.userId))) {
          socket.emit("error", { message: "[seek] Forbidden: you are not the host or room does not exist in DB" });
          return;
        }

        // Update Redis THEN emit — removed premature duplicate emit ✅
        const state = JSON.parse(
          (await redisClient.get(`room:${roomId}:state`)) || "{}"
        );
        state.currentTime = time;
        await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

        socket.to(roomId).emit("seek", { time });

      } catch (err) {
        console.error("[seek] error:", err.message);
        socket.emit("error", { message: "Server error during seek" });
      }
    });


    // ── change_video ──────────────────────────────────────────────────────
    socket.on("change_video", async ({ roomId, videoId }) => {
      try {
        if (!socket.userId) {
          socket.emit("error", { message: "Emit join_room before change_video" });
          return;
        }

        if (!(await isHost(roomId, socket.userId))) {
          socket.emit("error", { message: "[change_video] Forbidden: you are not the host or room does not exist in DB" });
          return;
        }

        const newState = {
          videoId,
          isPlaying: false,
          currentTime: 0
        };

        // Save to Redis THEN emit once ✅
        await redisClient.set(`room:${roomId}:state`, JSON.stringify(newState));

        socket.to(roomId).emit("change_video", newState);

      } catch (err) {
        console.error("[change_video] error:", err.message);
        socket.emit("error", { message: "Server error during change_video" });
      }
    });


    // ── leave_room ────────────────────────────────────────────────────────
    socket.on("leave_room", async ({ roomId, userId, username }) => {
      try {
        // Use socket-stored values as fallback in case client doesn't send them
        const rId = roomId   || socket.roomId;
        const uId = userId   || socket.userId;
        const uName = username || socket.username;

        await handleLeave(socket, rId, uId, uName);
        console.log(`[leave_room] ${uName} left ${rId}`);

      } catch (err) {
        console.error("[leave_room] error:", err.message);
      }
    });


    // ── disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log("❌ User disconnected:", socket.id, socket.username || "");
      // Re-use the same cleanup so hard disconnects (browser close) are handled
      if (socket.roomId && socket.userId) {
        await handleLeave(socket, socket.roomId, socket.userId, socket.username);
      }
    });


    // ── debug: log every event (remove in production) ────────────────────
    socket.onAny((event, ...args) => {
      console.log("📡 EVENT:", event, JSON.stringify(args).slice(0, 200));
    });
  });
};

module.exports = handleSocket;
