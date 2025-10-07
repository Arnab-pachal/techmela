import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
import cloudinary from "../lib/cloudinary.js";
import User from "../models/userschema.js";
import Message from "../models/message.model.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

// used to store online users
const userSocketMap = {}; // { userId: socketId }

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("⚡ A user connected:", socket.id);

  // User joins with their ID
  const userId = socket.handshake.query.userId;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  /**
   * 🧩 Fetch users for sidebar
   */
  socket.on("getUsersForSidebar", async (currentUserId, callback) => {
    try {
      const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");
      callback(users);
    } catch (err) {
      console.error("Error in getUsersForSidebar:", err.message);
      callback({ error: "Internal server error" });
    }
  });

  /**
   * 💬 Get previous messages between two users
   */
  socket.on("getMessages", async ({ myId, userToChatId }, callback) => {
    try {
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
      callback(messages);
    } catch (err) {
      console.error("Error in getMessages:", err.message);
      callback({ error: "Internal server error" });
    }
  });

  /**
   * 🚀 Send a new message (text/image)
   */
  socket.on("sendMessage", async ({ senderId, receiverId, text, image }) => {
    try {
      let imageUrl = null;
      if (image) {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl,
      });

      await newMessage.save();

      // Send to receiver (if online)
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      // Send to sender also (for immediate update)
      socket.emit("messageSent", newMessage);
    } catch (err) {
      console.error("Error in sendMessage:", err.message);
      socket.emit("error", { error: "Failed to send message" });
    }
  });

  /**
   * ❌ Delete a message
   */
  socket.on("deleteMessage", async ({messageId,userId}) => {
    try {
      const message = await Message.findByIdAndDelete(messageId);
      if (!message) {
        socket.emit("error", { error: "Message not found" });
        return;
      }
    
      const { senderId, receiverId } = message;

      // Fetch updated conversation
      const allMessages = await Message.find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
     
      // Notify both users about update
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("allMessages", allMessages);
      }
      socket.emit("allMessages", allMessages);
    } catch (err) {
      console.error("Error in deleteMessage:", err.message);
      socket.emit("error", { error: "Failed to delete message" });
    }
  });

  /**
   * 📴 Handle disconnect
   */
  socket.on("disconnect", () => {
    console.log("❌ A user disconnected:", socket.id);
    for (const [uid, sid] of Object.entries(userSocketMap)) {
      if (sid === socket.id) {
        delete userSocketMap[uid];
        break;
      }
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
