// model/structure.js
const mongoose = require('mongoose');

const StructureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // you can add more fields here as needed, e.g.
  // description: String,
});

module.exports = mongoose.model('StructureData', StructureSchema);
