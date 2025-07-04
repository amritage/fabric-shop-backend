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
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('StructureData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid structureId: No matching StructureData found',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubstructureData', SubstructureSchema);
