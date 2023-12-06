import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    testName: {
      type: String,
      required: true,
    },
    solutions: {
      type: [
        {
          questionId: {
            type: mongoose.Types.ObjectId,
            required: true,
          },
          optionId: {
            type: mongoose.Types.ObjectId,
            default: null,
          },
          visitedFlag: {
            type: Boolean,
            required: true,
          },
        },
      ],
      required: true,
    },
    marksObtained: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const recordModel = new mongoose.model("record", recordSchema);
