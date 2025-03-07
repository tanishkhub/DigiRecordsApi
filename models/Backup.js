const mongoose = require("mongoose");

const backupSchema = new mongoose.Schema(
  {
    // Use the same custom _id as in the User model
    _id: {
      type: String,
      required: true,
    },
    generalInfo: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
      default: [],
    },
    familyMembers: {
      type: [{ type: mongoose.Schema.Types.Mixed }],
      default: [],
    },
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Backup", backupSchema);
