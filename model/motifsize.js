// model/motifsize.js
const mongoose = require('mongoose');

const MotifsizeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // add extra fields here as needed, e.g.:
    // description: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('MotifsizeData', MotifsizeSchema);
