import { testModel } from "../models/test.model.js";
import { questionModel } from "../models/question.model.js";
import { authModel } from "../models/auth.model.js";

export const getAvailableTests = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const err = new Error("User not logged in");
      throw err;
    }

    // finding user in db
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    const tests = await testModel.find();

    res.json({ success: true, message: "test found and returned", tests });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const err = new Error("User not logged in");
      throw err;
    }

    const { testName } = req.body;
    if (!testName) {
      const err = new Error("Invalid test name");
      throw err;
    }

    // finding user in db
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // finding test
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error("Test not found");
      throw err;
    }

    // getting the question
    const questions = await questionModel.findOne({ testName });
    if (!questions) {
      const err = new Error("question not found");
      throw err;
    }

    res.json({
      success: true,
      message: "Question found and sent",
      questions,
      test,
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
