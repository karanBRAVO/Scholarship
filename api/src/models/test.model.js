import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    marksPerQuestion: {
      type: Number,
      required: true,
    },
    negativeMarking: {
      type: Boolean,
      default: false,
      required: true,
    },
    timeAvailable: {
      type: String, // hh:mm:ss
      required: true,
    },
    timings: {
      startTime: {
        // YYYY-MM-DDTHH:MM:SSZ
        type: Date,
        required: true,
      },
      endTime: {
        // YYYY-MM-DDTHH:MM:SSZ
        type: Date,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const testModel = new mongoose.model("testdescription", testSchema);
