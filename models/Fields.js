const mongoose = require("mongoose");

const fieldsSchema = new mongoose.Schema({
  fields: {
    generalInfo: { type: [String], default: [] },
    familyMembers: { type: [String], default: [] }, // Now stores strings, not objects
    additionalInfo: { type: String, default: "" }
  }
});

module.exports = mongoose.model("Fields", fieldsSchema);
