import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bcrypt from "bcrypt";

import authRoutes from "./routes/authRoutes.js";
import stressRoutes from "./routes/stress.js";
import journalRoutes from "./routes/journalRoutes.js";
import counselorRoutes from "./routes/counselorRoutes.js";
import Counselor from "./models/Counselor.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({ message: "SoulHeal backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/stress", stressRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/counselor", counselorRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();
    const seedCounselors = [
      {
        counselorName: "Dr. Anaya Rao",
        email: "counselor@soulheal.app",
        specialization: "Stress, burnout, and emotional wellness",
        password: "care1234",
      },
      {
        counselorName: "Dr. Meera Shah",
        email: "support@soulheal.app",
        specialization: "Anxiety support and guided coping strategies",
        password: "calm1234",
      },
    ];

    for (const counselorData of seedCounselors) {
      const existingCounselor = await Counselor.findOne({
        email: counselorData.email,
      });

      if (!existingCounselor) {
        const password = await bcrypt.hash(counselorData.password, 10);
        await Counselor.create({
          counselorName: counselorData.counselorName,
          email: counselorData.email,
          specialization: counselorData.specialization,
          password,
        });
      }
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
