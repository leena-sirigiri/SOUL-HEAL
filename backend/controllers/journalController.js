import Journal from "../models/Journel.js";

// CREATE
export const createEntry = async (req, res) => {
  try {
    const entry = await Journal.create({
      userId: req.user.id,
      mood: req.body.mood,
      text: req.body.text
    });

    res.json(entry);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// READ
export const getEntries = async (req, res) => {
  try {
    const data = await Journal.find({ userId: req.user.id });
    res.json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// UPDATE
export const updateEntry = async (req, res) => {
  try {
    const updated = await Journal.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

// DELETE
export const deleteEntry = async (req, res) => {
  try {
    await Journal.findByIdAndDelete(req.params.id);
    res.json("Deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
};
