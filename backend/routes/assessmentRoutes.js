const router = require("express").Router();
const Assessment = require("../models/Assessment");

router.post("/add", async (req, res) => {
  const data = new Assessment(req.body);
  await data.save();
  res.json("Assessment saved");
});

router.get("/:studentId", async (req, res) => {
  const data = await Assessment.find({ studentId: req.params.studentId });
  res.json(data);
});

module.exports = router;