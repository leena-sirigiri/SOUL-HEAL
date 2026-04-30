const mongoose = require("mongoose");
export default router; 
const StressSchema = new mongoose.Schema({
  email: String,
  score: Number,
  result: String,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Stress", StressSchema);