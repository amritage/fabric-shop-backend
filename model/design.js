// model/design.js
const mongoose = require('mongoose');

const DesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // add other fields here if needed, e.g.:
    // description: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model('DesignData', DesignSchema);
