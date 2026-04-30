import mongoose from "mongoose";

const journalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  mood: String,
  text: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Journal", journalSchema);