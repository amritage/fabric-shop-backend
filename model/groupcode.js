const mongoose = require('mongoose');

const GroupCodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      required: false,
      
    },
    video: {
      type: String,
      required: false,
      
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('GroupCode', GroupCodeSchema);
