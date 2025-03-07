const express = require("express");
const Gotra = require("../models/Gotra");
const router = express.Router();

// 📌 Add a New Gotra
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Gotra name is required" });

    const newGotra = new Gotra({ name });
    await newGotra.save();

    res.status(201).json({ message: "Gotra added successfully", gotra: newGotra });
  } catch (error) {
    res.status(500).json({ error: "Error adding gotra", details: error.message });
  }
});

// 📌 Get All Gotras
router.get("/all", async (req, res) => {
  try {
    const gotras = await Gotra.find().sort({ name: 1 });
    res.status(200).json(gotras);
  } catch (error) {
    res.status(500).json({ error: "Error fetching gotras", details: error.message });
  }
});

// 📌 Delete a Gotra
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Gotra.findByIdAndDelete(id);
    res.status(200).json({ message: "Gotra deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting gotra", details: error.message });
  }
});

module.exports = router;
