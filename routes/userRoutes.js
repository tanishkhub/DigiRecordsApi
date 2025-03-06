const express = require("express");
const User = require("../models/user");
const Fields = require("../models/fields");

const router = express.Router();

/**
 * GET: Fetch all users
 */
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * POST: Add a new user (Validates against dynamic fields)
 */
router.post("/add", async (req, res) => {
  try {
    console.log("Received Data:", req.body); // Log the received data for debugging

    let fieldsDoc = await Fields.findOne();
    if (!fieldsDoc) {
      return res.status(400).json({ message: "Fields document not found" });
    }

    const allowedGeneralFields = fieldsDoc.fields.generalInfo || [];
    const allowedFamilyFields = fieldsDoc.fields.familyMembers || [];

    const { generalInfo, familyMembers, additionalInfo } = req.body;

    let invalidFields = [];

    if (generalInfo) {
      const invalidGeneral = Object.keys(generalInfo).filter(
        (field) => !allowedGeneralFields.includes(field)
      );
      invalidFields = [...invalidFields, ...invalidGeneral.map(f => `generalInfo.${f}`)];
    }

    if (Array.isArray(familyMembers)) {
      familyMembers.forEach((member, index) => {
        const invalidFamily = Object.keys(member).filter(
          (field) => !allowedFamilyFields.includes(field)
        );
        invalidFields = [...invalidFields, ...invalidFamily.map(f => `familyMembers[${index}].${f}`)];
      });
    } else if (familyMembers) {
      return res.status(400).json({
        message: "Invalid format: 'familyMembers' should be an array",
      });
    }

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields detected",
        invalidFields,
      });
    }

    const newUser = new User({ generalInfo, familyMembers, additionalInfo });
    await newUser.save();

    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});


/**
 * GET: Fetch user by ID
 */
router.get("/:id", async (req, res) => {
  try {
    // Check if the :id param includes commas to indicate multiple IDs
    if (req.params.id.includes(",")) {
      // Split the string, remove duplicates, and trim any whitespace
      const uniqueIds = [
        ...new Set(
          req.params.id.split(",").map((id) => id.trim())
        ),
      ];

      // Fetch all users with IDs in the uniqueIds array
      const users = await User.find({ _id: { $in: uniqueIds } });
      if (!users || users.length === 0)
        return res.status(404).json({ message: "Users not found" });
      return res.json(users);
    } else {
      // Handle a single user id
      const user = await User.findById(req.params.id);
      if (!user)
        return res.status(404).json({ message: "User not found" });
      return res.json(user);
    }
  } catch (error) {
    console.error("Error fetching user(s):", error);
    res.status(500).json({ message: "Server Error" });
  }
});


/**
 * PUT: Update user details (Only allowed fields)
 */
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Clone the updateData to avoid modifying req.body directly
    let updateData = { ...req.body };

    // Remove extra properties that should not be updated
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;
    delete updateData.__v;

    // Retrieve the allowed fields from the fields document
    let fieldsDoc = await Fields.findOne();
    if (!fieldsDoc) {
      return res.status(400).json({ message: "Fields document not found" });
    }

    const allowedGeneral = fieldsDoc.fields.generalInfo;
    const allowedFamily = fieldsDoc.fields.familyMembers;

    let invalidFields = [];

    // Validate generalInfo if provided and is an array
    if (updateData.generalInfo && Array.isArray(updateData.generalInfo)) {
      const general = updateData.generalInfo[0] || {};
      Object.keys(general).forEach(field => {
        if (!allowedGeneral.includes(field)) {
          invalidFields.push(`generalInfo.${field}`);
        }
      });
    }

    // Validate each object in familyMembers if provided
    if (updateData.familyMembers && Array.isArray(updateData.familyMembers)) {
      updateData.familyMembers.forEach((member, index) => {
        Object.keys(member).forEach(field => {
          if (!allowedFamily.includes(field)) {
            invalidFields.push(`familyMembers[${index}].${field}`);
          }
        });
      });
    }

    // Optionally validate additionalInfo if needed

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields detected",
        invalidFields,
      });
    }

    // Update the user document with the cleaned updateData
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});


/**
 * DELETE: Remove user by ID
 */
router.delete("/", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: "No users provided for deletion" });
    }
    await User.deleteMany({ _id: { $in: ids } });
    res.json({ message: "Users deleted successfully" });
  } catch (error) {
    console.error("Error deleting users:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
