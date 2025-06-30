// model/subfinish.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubfinishSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    finishId: {
      type: Schema.Types.ObjectId,
      ref: 'FinishData',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubfinishData', SubfinishSchema);
