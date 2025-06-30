// model/vendor.js
const mongoose = require('mongoose');

const VendorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    // add more fields here if you need, e.g. contactInfo, address, etc.
  },
  { timestamps: true },
);

module.exports = mongoose.model('VendorData', VendorSchema);
