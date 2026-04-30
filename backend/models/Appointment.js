const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  studentId: String,
  counselorId: String,
  appointmentDate: String,
  status: String
});

module.exports = mongoose.model("Appointment", AppointmentSchema);