// model/substructure.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const SubstructureSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    structureId: {
      type: Schema.Types.ObjectId,
      ref: 'StructureData',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubstructureData', SubstructureSchema);
