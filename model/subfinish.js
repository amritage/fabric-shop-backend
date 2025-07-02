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
      validate: {
        validator: async function (value) {
          const exists = await mongoose
            .model('FinishData')
            .exists({ _id: value });
          return exists !== null;
        },
        message: 'Invalid finishId: No matching FinishData found',
      },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('SubfinishData', SubfinishSchema);
