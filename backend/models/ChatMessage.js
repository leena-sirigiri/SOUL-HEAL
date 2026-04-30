import mongoose from "mongoose";

const chatMessageSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    senderRole: { type: String, enum: ["user", "counselor"], required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model("ChatMessage", chatMessageSchema);
