const express = require("express");
const Fields = require("../models/fields");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let fieldsDoc = await Fields.findOne();
    if (!fieldsDoc) {
      fieldsDoc = new Fields({ fields: { generalInfo: [], familyMembers: [], additionalInfo: "Additional Information (if any)" } });
      await fieldsDoc.save();
    }

    console.log("Fetched Fields:", fieldsDoc.fields); // Debugging
    res.json(fieldsDoc.fields);
  } catch (error) {
    console.error("Error fetching fields:", error);
    res.status(500).json({ message: "Server Error" });
  }
});




router.post("/add", async (req, res) => {
  const { category, newFields } = req.body;

  if (!Array.isArray(newFields)) {
    return res.status(400).json({ message: "newFields should be an array" });
  }

  try {
    let fieldsDoc = await Fields.findOne();
    if (!fieldsDoc) {
      fieldsDoc = new Fields({ fields: { generalInfo: [], familyMembers: [], additionalInfo: "" } });
    }

    if (category === "generalInfo" || category === "familyMembers") {
      if (!Array.isArray(fieldsDoc.fields[category])) {
        fieldsDoc.fields[category] = [];
      }
      fieldsDoc.fields[category].push(...newFields);
    } else {
      fieldsDoc.fields[category] = newFields[0]; // For additionalInfo (single string)
    }

    await fieldsDoc.save();
    res.json(fieldsDoc.fields);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


// Remove specific fields
router.post("/remove", async (req, res) => {
  const { category, removeFields } = req.body;

  if (!category || !removeFields || !Array.isArray(removeFields)) {
    return res.status(400).json({ message: "Invalid request format" });
  }

  try {
    let fieldsDoc = await Fields.findOne();
    if (!fieldsDoc || !fieldsDoc.fields[category]) {
      return res.status(404).json({ message: "Fields not found" });
    }

    fieldsDoc.fields[category] = fieldsDoc.fields[category].filter(
      (field) => !removeFields.includes(field)
    );

    await fieldsDoc.save();
    res.json(fieldsDoc.fields);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
