import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Counselor from "../models/Counselor.js";
import Assessment from "../models/Assessment.js";
import ChatMessage from "../models/ChatMessage.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const counselor = await Counselor.findOne({ email: email.toLowerCase() });
    if (!counselor) {
      return res.status(400).json({ error: "Counselor not found" });
    }

    const matches = await bcrypt.compare(password, counselor.password);
    if (!matches) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = jwt.sign(
      { id: counselor._id, role: "counselor" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      email: counselor.email,
      counselorName: counselor.counselorName,
      specialization: counselor.specialization,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/high-risk", async (req, res) => {
  try {
    const data = await Assessment.find({
      level: { $in: ["High Stress", "Severe Stress"] },
    })
      .sort({ createdAt: -1 })
      .limit(30);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/messages/:userEmail", async (req, res) => {
  try {
    const messages = await ChatMessage.find({
      userEmail: req.params.userEmail.toLowerCase(),
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { userEmail, senderRole, senderName, text } = req.body;

    if (!userEmail || !senderRole || !senderName || !text?.trim()) {
      return res.status(400).json({ error: "Missing chat message fields" });
    }

    const message = await ChatMessage.create({
      userEmail: userEmail.toLowerCase(),
      senderRole,
      senderName,
      text: text.trim(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
