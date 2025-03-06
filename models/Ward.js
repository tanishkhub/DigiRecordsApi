const mongoose = require("mongoose");

const wardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure no duplicate ward names
    trim: true,
  },
});

module.exports = mongoose.model("Ward", wardSchema);
