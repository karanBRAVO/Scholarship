import { adminModel } from "../models/admin.model.js";
import { authModel } from "../models/auth.model.js";
import { questionModel } from "../models/question.model.js";
import { recordModel } from "../models/record.model.js";
import { testModel } from "../models/test.model.js";
import { getAvailableTime } from "../utils/getAvailableTime.js";

export const getTestDetials = async (req, res) => {
  try {
    // getting the admin id
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    // checking if admin exists
    const admin = await adminModel.findOne({ _id: userId });
    if (!admin) {
      const err = new Error("You are not authorized");
      throw err;
    }

    // getting the test name
    const { testName } = req.params;
    if (!testName || testName.length == 0) {
      const err = new Error("Invalid test name");
      throw err;
    }

    // fetching the test details from the database
    const testDetails = await testModel.findOne({ testName });
    if (!testDetails) {
      const error = new Error("No test details found");
      throw error;
    }

    // fetching the all registered users
    const users = await authModel.find();
    if (users.length == 0) {
      const err = new Error("No one has registered");
      throw err;
    }
    // extracting the required information
    const userData = [];
    users.forEach((user, index) => {
      userData.push({
        userId: user._id,
        name: user.firstName + " " + user.lastName,
        email: user.email,
        mobileNumber: user.mobileNumber,
      });
    });

    // getting the marks
    const records = await recordModel.find({ testName });
    if (records.length == 0) {
      const err = new Error("No one has submitted the test yet");
      throw err;
    }
    // extract the results
    const usersResults = [];
    records.forEach((record, index) => {
      usersResults.push({ userId: record.userId, marks: record.marksObtained });
    });

    // data to be sent
    const data = {
      testDetails,
      usersDetails: userData,
      usersResults,
    };

    res.json({ success: true, message: "Details sent successfully", data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

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

    const {
      testName,
      totalQuestions,
      marksPerQuestion,
      negativeMarking,
      startTime,
      endTime,
    } = req.body;

    // calculate time
    const timeAvailable = getAvailableTime(startTime, endTime);

    // saving the details
    const addTest = new testModel({
      testName,
      totalQuestions,
      marksPerQuestion,
      negativeMarking,
      timeAvailable,
      timings: {
        startTime: startTime,
        endTime: endTime,
      },
    });
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

    // finding questions
    const questions_exits = await questionModel.findOne({ testName });
    if (questions_exits) {
      const err = new Error("Questions are already added");
      throw err;
    }

    // checking the total questions
    if (question.length != test.totalQuestions) {
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
