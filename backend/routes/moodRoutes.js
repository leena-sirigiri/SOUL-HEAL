const router = require("express").Router();
const Mood = require("../models/Mood");

// ADD MOOD
router.post("/add", async (req, res) => {
  try {
    const mood = new Mood(req.body);
    await mood.save();
    res.json("Mood saved");
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MOODS
router.get("/:userId", async (req, res) => {
  try {
    const moods = await Mood.find({ userId: req.params.userId });
    res.json(moods);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;