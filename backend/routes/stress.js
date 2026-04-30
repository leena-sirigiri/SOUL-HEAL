import express from "express";
import Assessment from "../models/Assessment.js";

const router = express.Router();

const marksPerAnswer = [0, 1.25, 2.5, 3.75, 5];
const scoreAssessment = (answers) =>
  answers.reduce((total, answer) => {
    return total + (marksPerAnswer[answer] ?? 0);
  }, 0);

const getLevel = (score) => {
  if (score > 37) {
    return {
      level: "Severe Stress",
      recommendedAction: "Your stress level is very high. Please talk to a counselor now.",
    };
  }

  if (score > 25) {
    return {
      level: "High Stress",
      recommendedAction: "Your stress level is high. Talking to a counselor is strongly recommended.",
    };
  }

  if (score >= 13) {
    return {
      level: "Moderate Stress",
      recommendedAction: "Your stress is moderate. Use calming routines and monitor how you feel.",
    };
  }

  return {
    level: "Low Stress",
    recommendedAction: "Your stress is currently low. Keep supporting your healthy routine.",
  };
};

router.get("/", (req, res) => {
  res.send("Stress API working");
});

router.post("/assessment", async (req, res) => {
  try {
    const { answers, userEmail, userName } = req.body;

    if (!Array.isArray(answers) || answers.length !== 10) {
      return res.status(400).json({ error: "10 answers are required" });
    }

    const score = Number(scoreAssessment(answers).toFixed(2));
    const { level, recommendedAction } = getLevel(score);

    const assessment = await Assessment.create({
      userEmail: (userEmail || "guest@soulheal.app").toLowerCase(),
      userName: userName || "SoulHeal User",
      score,
      level,
      answers,
      recommendedAction,
    });

    res.status(201).json({
      id: assessment._id,
      score,
      level,
      recommendedAction,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/high-risk", async (req, res) => {
  try {
    const data = await Assessment.find({ level: "High Stress" })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
