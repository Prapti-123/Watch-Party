// src/sockets/socketHandler.js

const {redisClient} = require("../lib/redis");
const isHost = require("../utils/isHost");




const handleSocket = (io) => {
 io.on("connection", (socket) => {   // ✅ yaha socket define hota hai
    console.log("User connected:", socket.id);  

    // join room
    socket.on("join_room", async ({ roomId,userId, username }) => {
      socket.join(roomId);

       // 🔥 socket me userId store
      socket.userId = userId;
      socket.username = username;
    
      socket.roomId = roomId;

      console.log(`${username} joined ${roomId}`);

       // 🔥 redisClient se state lao
      const state = await redisClient.get(`room:${roomId}:state`);

      if (state) {
        socket.emit("sync_state", JSON.parse(state));
      }

      socket.to(roomId).emit("user_joined", {
        username
      });
    });



    // play
   socket.on("play", async ({ roomId, currentTime }) => {
  if (!(await isHost(roomId, socket.userId))) return;

  const state = JSON.parse(
    (await redisClient.get(`room:${roomId}:state`)) || "{}"
  );

  state.isPlaying = true;
  state.currentTime = currentTime;

  await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

  // ✅ sirf ek baar emit
  socket.to(roomId).emit("play", { currentTime });
});

    // pause
      socket.on("pause", async ({ roomId, currentTime }) => {
          if (!(await isHost(roomId, socket.userId))) return;

  socket.to(roomId).emit("pause", { currentTime });

      const state = JSON.parse(
        (await redisClient.get(`room:${roomId}:state`)) || "{}"
      );

      state.isPlaying = false;
      state.currentTime = currentTime;

      await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

      socket.to(roomId).emit("pause", { currentTime });
    });

    // seek
  socket.on("seek", async ({ roomId, time }) => {
     if (!(await isHost(roomId, socket.userId))) return;

  socket.to(roomId).emit("seek", { time });

      const state = JSON.parse(
        (await redisClient.get(`room:${roomId}:state`)) || "{}"
      );

      state.currentTime = time;

      await redisClient.set(`room:${roomId}:state`, JSON.stringify(state));

      socket.to(roomId).emit("seek", { time });
    });

    // change video
     socket.on("change_video", async ({ roomId, videoId }) => {
       if (!(await isHost(roomId, socket.userId))) return;

  socket.to(roomId).emit("change_video", { videoId });

      const newState = {
        videoId,
        isPlaying: false,
        currentTime: 0
      };

      // 🔥 redisClient me save
      await redisClient.set(`room:${roomId}:state`, JSON.stringify(newState));

      socket.to(roomId).emit("change_video", newState);
    });

    // leave room
    socket.on("leave_room", ({ roomId, username }) => {
      socket.leave(roomId);

      socket.to(roomId).emit("user_left", {
        username
      });
    });

    socket.onAny((event, ...args) => {
  console.log("📡 EVENT:", event, args);
});

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};


module.exports = handleSocket;

