// model/finish.js
const mongoose = require('mongoose');

const FinishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // add more fields here as needed
  },
  { timestamps: true },
);

module.exports = mongoose.model('FinishData', FinishSchema);
