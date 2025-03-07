const express = require("express");
const Tehsil = require("../models/Tehsil");
const router = express.Router();

// 📌 Add a New Tehsil
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Tehsil name is required" });

    const newTehsil = new Tehsil({ name });
    await newTehsil.save();

    res.status(201).json({ message: "Tehsil added successfully", tehsil: newTehsil });
  } catch (error) {
    res.status(500).json({ error: "Error adding tehsil", details: error.message });
  }
});

// 📌 Get All Tehsils
router.get("/all", async (req, res) => {
  try {
    const tehsils = await Tehsil.find().sort({ name: 1 });
    res.status(200).json(tehsils);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tehsils", details: error.message });
  }
});

// 📌 Delete a Tehsil
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Tehsil.findByIdAndDelete(id);
    res.status(200).json({ message: "Tehsil deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting tehsil", details: error.message });
  }
});

module.exports = router;
