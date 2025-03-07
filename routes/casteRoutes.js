const express = require("express");
const Caste = require("../models/Caste");
const router = express.Router();

// 📌 Add a New Caste
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Caste name is required" });

    const newCaste = new Caste({ name });
    await newCaste.save();

    res.status(201).json({ message: "Caste added successfully", caste: newCaste });
  } catch (error) {
    res.status(500).json({ error: "Error adding caste", details: error.message });
  }
});

// 📌 Get All Castes
router.get("/all", async (req, res) => {
  try {
    const castes = await Caste.find().sort({ name: 1 });
    res.status(200).json(castes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching castes", details: error.message });
  }
});

// 📌 Delete a Caste
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Caste.findByIdAndDelete(id);
    res.status(200).json({ message: "Caste deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting caste", details: error.message });
  }
});

module.exports = router;
