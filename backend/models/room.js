const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  userId: String,          // unique id (uuid or socketId)
  username: String,
  role: {
    type: String,
    enum: ["host", "viewer"],
    default: "viewer"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const chatSchema = new mongoose.Schema({
  userId: String,
  username: String,
  message: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    unique: true,
    required: true
  },

  hostId: {
    type: String,
    required: true
  },

  // 👥 Participants
  participants: [participantSchema],

  // 🎥 Current Video
  videoId: {
    type: String,
    default: null
  },

  videoTitle: String,
  videoDuration: Number, // seconds

  // ⏯ Playback State (VERY IMPORTANT)
  playback: {
    isPlaying: {
      type: Boolean,
      default: false
    },
    currentTime: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // 📃 Queue system (future feature)
  queue: [
    {
      videoId: String,
      title: String,
      addedBy: String
    }
  ],

  // 💬 Chat messages (optional)
  chat: [chatSchema],

  // 🔒 Room settings
  settings: {
    
    allowChat: {
      type: Boolean,
      default: true
    },
    allowQueue: {
      type: Boolean,
      default: true
    },
    allowControl: {
      type: Boolean,
      default: true // viewers can control or not
    }
  },

  // 📊 Analytics / meta
  totalJoins: {
    type: Number,
    default: 0
  },

  // ⚡ Status
  isActive: {
    type: Boolean,
    default: true
  },

  endedAt: Date,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Room = mongoose.model("Room", roomSchema);
module.exports = Room;