import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testName: {
      type: String,
      ref: "testdetails",
      required: true,
      unique: true,
    },
    question: {
      type: [
        {
          questionText: {
            type: String,
            required: true,
            trim: true,
          },
          questionOption: {
            type: [
              {
                answerText: {
                  type: String,
                  required: true,
                },
                isCorrect: {
                  type: Boolean,
                  default: false,
                  required: true,
                },
              },
            ],
            required: true,
          },
        },
      ],
      required: true,
    },
  },
  { timeseries: true, timestamps: true }
);

export const questionModel = new mongoose.model("question", questionSchema);
