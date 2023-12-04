import { adminModel } from "../models/admin.model.js";
import { questionModel } from "../models/question.model.js";
import { testModel } from "../models/test.model.js";

export const addTestDetails = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    const admin = await adminModel.findOne({ _id: userId });
    if (!admin) {
      const err = new Error("You are not authorized");
      throw err;
    }

    const addTest = new testModel(req.body);
    await addTest.save();

    res.json({ success: true, message: "Test details added" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const addQuestions = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    const admin = await adminModel.findOne({ _id: userId });
    if (!admin) {
      const err = new Error("You are not authorized");
      throw err;
    }

    const { testName, question } = req.body;
    if (!testName || question.length === 0) {
      const err = new Error("detials must be provided");
      throw err;
    }

    // checking the test name
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error(testName + " not found");
      throw err;
    }

    // checking the total questions
    if (question.length > test.totalQuestions) {
      const err = new Error(
        testName + " has a limit of " + test.totalQuestions + " questions"
      );
      throw err;
    }

    const addQuestions = new questionModel(req.body);
    await addQuestions.save();

    res.json({ success: true, message: "questions added successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
