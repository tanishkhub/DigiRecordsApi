const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('Education', EducationSchema);
