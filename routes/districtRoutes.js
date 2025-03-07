const express = require("express");
const District = require("../models/District");
const router = express.Router();

// 📌 Add a New District
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "District name is required" });

    const newDistrict = new District({ name });
    await newDistrict.save();

    res.status(201).json({ message: "District added successfully", district: newDistrict });
  } catch (error) {
    res.status(500).json({ error: "Error adding district", details: error.message });
  }
});

// 📌 Get All Districts
router.get("/all", async (req, res) => {
  try {
    const districts = await District.find().sort({ name: 1 });
    res.status(200).json(districts);
  } catch (error) {
    res.status(500).json({ error: "Error fetching districts", details: error.message });
  }
});

// 📌 Delete a District
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await District.findByIdAndDelete(id);
    res.status(200).json({ message: "District deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting district", details: error.message });
  }
});

module.exports = router;
