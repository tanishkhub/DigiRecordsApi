const express = require("express");
const Ward = require("../models/Ward");
const router = express.Router();

// 📌 Add a New Ward
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Ward name is required" });

    const newWard = new Ward({ name });
    await newWard.save();

    res.status(201).json({ message: "Ward added successfully", ward: newWard });
  } catch (error) {
    res.status(500).json({ error: "Error adding ward", details: error.message });
  }
});

// 📌 Get All Wards
router.get("/all", async (req, res) => {
  try {
    const wards = await Ward.find().sort({ name: 1 });
    res.status(200).json(wards);
  } catch (error) {
    res.status(500).json({ error: "Error fetching wards", details: error.message });
  }
});

// 📌 Delete a Ward
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Ward.findByIdAndDelete(id);
    res.status(200).json({ message: "Ward deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting ward", details: error.message });
  }
});

module.exports = router;
