const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    generalInfo: {
      type: [{ type: mongoose.Schema.Types.Mixed }], // Array of dynamic objects
      default: [],
    },
    familyMembers: {
      type: [{ type: mongoose.Schema.Types.Mixed }], // Array of dynamic objects
      default: [],
    },
    additionalInfo: {
      type: mongoose.Schema.Types.Mixed, // Can be any type (object, string, etc.)
      default: {},
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt timestamps
);

module.exports = mongoose.model("User", userSchema);
