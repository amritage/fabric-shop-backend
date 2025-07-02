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
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('SuitableforData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid suitableforId: No matching SuitableforData found',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubsuitableData', SubSuitableSchema);
