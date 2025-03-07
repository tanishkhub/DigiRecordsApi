const express = require("express");
const Backup = require("../models/Backup");

const router = express.Router();

/**
 * GET: Fetch all backups
 */
router.get("/", async (req, res) => {
  try {
    const backups = await Backup.find();
    res.json(backups);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * GET: Fetch backup by ID (supports comma separated IDs)
 */
router.get("/:id", async (req, res) => {
  try {
    if (req.params.id.includes(",")) {
      const uniqueIds = [
        ...new Set(req.params.id.split(",").map((id) => id.trim())),
      ];
      const backups = await Backup.find({ _id: { $in: uniqueIds } });
      if (!backups || backups.length === 0)
        return res.status(404).json({ message: "Backups not found" });
      return res.json(backups);
    } else {
      const backup = await Backup.findById(req.params.id);
      if (!backup)
        return res.status(404).json({ message: "Backup not found" });
      return res.json(backup);
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * PUT: Update backup details
 */
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Clone update data to avoid modifying req.body directly
    let updateData = { ...req.body };

    // Remove properties that should not be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    const updatedBackup = await Backup.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedBackup) {
      return res.status(404).json({ message: "Backup not found" });
    }

    res.json({
      message: "Backup updated successfully",
      updatedBackup,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * DELETE: Remove backup(s) by IDs
 */
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res
        .status(400)
        .json({ message: "No backups provided for deletion" });
    }
    await Backup.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Backups deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
