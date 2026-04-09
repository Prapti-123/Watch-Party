const Room = require("../models/Room");

const isHost = async (roomId, userId) => {
  const room = await Room.findOne({ roomId });

  if (!room) return false;

  const user = room.participants.find(
    (p) => p.userId === userId
  );

  return user?.role === "host";
};

module.exports = isHost;