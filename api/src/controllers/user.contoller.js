import { testModel } from "../models/test.model.js";
import { questionModel } from "../models/question.model.js";
import { authModel } from "../models/auth.model.js";
import { recordModel } from "../models/record.model.js";
import { orderModel } from "../models/orders.model.js";
import { checkGreaterTime } from "../utils/ZuluFormat.js";

export const canGiveTest = async (req, res) => {
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

    // finding the test
    const { testName } = req.params;
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error("Test not found");
      throw err;
    }

    // checking the test timings
    if (!checkGreaterTime(test.timings.endTime)) {
      const err = new Error("Test has timed out");
      throw err;
    }
    if (checkGreaterTime(test.timings.startTime)) {
      const err = new Error("Test has not started");
      throw err;
    }

    // checking the order
    const order = await orderModel.findOne({ customerId: user._id });
    if (!order) {
      const err = new Error("Order not found");
      throw err;
    }
    if (!order.success) {
      const error = new Error("Order found | not successful");
      throw err;
    }

    // finding the record
    const record = await recordModel.findOne({ testName, userId: user._id });
    if (record) {
      const error = new Error("Record found | cannot give test");
      throw error;
    }

    res.json({ success: true, message: "Can give test" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

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
