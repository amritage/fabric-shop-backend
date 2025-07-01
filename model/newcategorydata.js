const mongoose = require('mongoose');

const newcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  image: {
    type: String, // we'll store the filename here
    required: false,
  },
});

module.exports = mongoose.model('newcategorydata', newcategorySchema);
