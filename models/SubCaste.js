const mongoose = require("mongoose");

const SubCasteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubCaste", SubCasteSchema);
