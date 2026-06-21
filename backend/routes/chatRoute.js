import express from "express";
import { authmiddleware } from "../middleware/auth.js";
import { getChatContacts, getChatHistory, sendMessage } from "../controllers/chatController.js";

const router = express.Router();

router.get("/contacts", authmiddleware, getChatContacts);
router.get("/history/:partnerId", authmiddleware, getChatHistory);
router.post("/send", authmiddleware, sendMessage);

export default router;
