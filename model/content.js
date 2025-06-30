const mongoose = require('mongoose');

const ContentSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model('ContentData', ContentSchema);
