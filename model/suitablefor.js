// model/suitablefor.js
const mongoose = require('mongoose');

const SuitableforSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // add more fields here if you like
  },
  { timestamps: true },
);

module.exports = mongoose.model('SuitableforData', SuitableforSchema);
