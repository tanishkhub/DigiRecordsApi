const mongoose = require("mongoose");

// Helper function to generate a random alphanumeric string of length 6
function generateReadableId() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  
  // Generate two random uppercase letters
  const randomLetters = letters[Math.floor(Math.random() * letters.length)] + 
                        letters[Math.floor(Math.random() * letters.length)];

  // Generate a random 6-digit number (from 100000 to 999999)
  const randomNumber = Math.floor(100000 + Math.random() * 900000);

  // Combine them together to form the ID
  return randomLetters + randomNumber;
}

console.log(generateReadableId());



const userSchema = new mongoose.Schema(
  {
    // Define _id as a String for our custom alphanumeric id
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

// Use pre('validate') hook to set the _id before validation occurs
userSchema.pre("validate", async function (next) {
  if (this.isNew && !this._id) {
    let uniqueId;
    let exists = true;
    // Loop until a unique id is generated
    while (exists) {
      uniqueId = generateReadableId();
      const doc = await this.constructor.findById(uniqueId);
      if (!doc) {
        exists = false;
      }
    }
    this._id = uniqueId;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
