import { asyncHandler } from "../middleware/asyncHandler.js";
import messageModel from "../models/messageModel.js";
import userModel from "../models/userModel.js";

// Fetch chat partners (contacts)
export const getChatContacts = asyncHandler(async (req, res) => {
  const { organizationId, role, _id } = req.user;

  let query = { organizationId };

  if (role === "admin") {
    // Admins can message anyone in their organization (both users and other admins) except themselves
    query._id = { $ne: _id };
  } else {
    // Users can only message admins in their organization
    query.role = "admin";
  }

  const contacts = await userModel.find(query).select("name email role");
  return res.status(200).json({ contacts });
});

// Fetch conversation history with a specific user
export const getChatHistory = asyncHandler(async (req, res) => {
  const { partnerId } = req.params;
  const userId = req.user._id;
  const orgId = req.user.organizationId;

  if (!partnerId) {
    return res.status(400).json({ message: "Partner ID is required" });
  }

  // Retrieve messages where sender and receiver are the two participants
  const messages = await messageModel.find({
    organizationId: orgId,
    $or: [
      { senderId: userId, receiverId: partnerId },
      { senderId: partnerId, receiverId: userId }
    ]
  }).sort({ createdAt: 1 });

  return res.status(200).json({ messages });
});

// Send a message
export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;
  const orgId = req.user.organizationId;

  if (!receiverId || !text) {
    return res.status(400).json({ message: "Receiver ID and message text are required" });
  }

  // Ensure receiver belongs to the same organization
  const receiver = await userModel.findOne({ _id: receiverId, organizationId: orgId });
  if (!receiver) {
    return res.status(404).json({ message: "Recipient not found in your organization" });
  }

  const message = await messageModel.create({
    senderId,
    receiverId,
    organizationId: orgId,
    text
  });

  // Emit the message real-time via Socket.io
  const io = req.app.get("socketio");
  if (io) {
    // Emit to the receiver's private room
    io.to(`user_${receiverId}`).emit("receive_message", message);
  }

  return res.status(201).json({ message });
});
