import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName: { type: String, default: "SoulHeal User" },
    assessmentType: { type: String, default: "PSS-10" },
    score: { type: Number, required: true },
    level: { type: String, required: true },
    answers: { type: [Number], default: [] },
    recommendedAction: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Assessment", assessmentSchema);
