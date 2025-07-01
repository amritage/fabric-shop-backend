// model/uniquecode.js
const mongoose = require('mongoose');

const UniqueCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('UniqueCodeData', UniqueCodeSchema);
