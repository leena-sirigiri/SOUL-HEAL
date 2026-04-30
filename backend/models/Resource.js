const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
  title: String,
  description: String
});

module.exports = mongoose.model("Resource", ResourceSchema);