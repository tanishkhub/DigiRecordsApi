const express = require("express");
const SubCaste = require("../models/SubCaste");
const router = express.Router();

// 📌 Add a New SubCaste
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "SubCaste name is required" });

    const newSubCaste = new SubCaste({ name });
    await newSubCaste.save();

    res.status(201).json({ message: "SubCaste added successfully", subCaste: newSubCaste });
  } catch (error) {
    res.status(500).json({ error: "Error adding sub caste", details: error.message });
  }
});

// 📌 Get All SubCastes
router.get("/all", async (req, res) => {
  try {
    const subCastes = await SubCaste.find().sort({ name: 1 });
    res.status(200).json(subCastes);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sub castes", details: error.message });
  }
});

// 📌 Delete a SubCaste
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await SubCaste.findByIdAndDelete(id);
    res.status(200).json({ message: "SubCaste deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting sub caste", details: error.message });
  }
});

module.exports = router;
