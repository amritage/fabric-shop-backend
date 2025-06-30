// model/subsuitable.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubSuitableSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    suitableforId: {
      type: Schema.Types.ObjectId,
      ref: 'SuitableforData',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubsuitableData', SubSuitableSchema);
