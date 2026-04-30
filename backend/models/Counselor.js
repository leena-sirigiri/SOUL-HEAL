import mongoose from "mongoose";

const counselorSchema = new mongoose.Schema(
  {
    counselorName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    specialization: { type: String, default: "Stress & emotional wellness" },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Counselor", counselorSchema);
