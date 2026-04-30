const router = require("express").Router();
const Appointment = require("../models/Appointment");

router.post("/book", async (req, res) => {
  const app = new Appointment(req.body);
  await app.save();
  res.json("Appointment booked");
});

router.get("/:studentId", async (req, res) => {
  const data = await Appointment.find({ studentId: req.params.studentId });
  res.json(data);
});

module.exports = router;