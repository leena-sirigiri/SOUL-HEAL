const router = require("express").Router();
const Resource = require("../models/Resource");

// ADD RESOURCE (Admin)
router.post("/add", async (req, res) => {
  const data = new Resource(req.body);
  await data.save();
  res.json("Resource Added");
});

// GET ALL RESOURCES (Student)
router.get("/", async (req, res) => {
  const data = await Resource.find();
  res.json(data);
});

module.exports = router;