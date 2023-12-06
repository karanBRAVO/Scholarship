import { authModel } from "../models/auth.model.js";
import { questionModel } from "../models/question.model.js";
import { recordModel } from "../models/record.model.js";
import { testModel } from "../models/test.model.js";

const getCorrectQuestionsCount = (questionsArray, answersArray) => {
  let c = 0;

  questionsArray.forEach((question, index) => {
    let markedOption = answersArray.find(
      (record) => record.questionId === String(question._id)
    );

    let correctOption = question.questionOption.find(
      (option) => option.isCorrect
    );

    if (String(correctOption._id) === markedOption.optionId) {
      c++;
    }
  });

  return c;
};

const getIncorrectQuestionCount = (questionsArray, answersArray) => {
  let c = 0;

  questionsArray.forEach((question) => {
    const markedOptionId = answersArray.find(
      (record) => record.questionId === String(question._id)
    ).optionId;

    const correctOptionId = String(
      question.questionOption.find((option) => option.isCorrect)._id
    );

    if (markedOptionId !== null && markedOptionId !== correctOptionId) {
      c++;
    }
  });

  return c;
};

export const updateResponses = async (req, res) => {
  try {
    // getting the user id from request
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    // finding user in the database
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // getting test name from url
    const testNameFromUrl = req.params.testName;

    // getting the data
    const { testName, solutions } = req.body;
    if (!testName || solutions.length == 0 || testName != testNameFromUrl) {
      const err = new Error("Invalid test name provided");
      throw err;
    }

    // finding the test in database
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error("No such test found");
      throw err;
    }

    // calculating the result
    const questions = await questionModel.findOne({ testName });
    if (!questions) {
      const err = new Error("No such data found");
      throw err;
    }
    const ques = questions.question;
    if (ques.length != solutions.length) {
      const err = new Error("Unknown number of solutions");
      throw err;
    }

    // checking previous record
    const prev_record = await recordModel.findOne({ userId, testName });
    if (!prev_record) {
      const err = new Error("Previous record not found");
      throw err;
    }

    const correctQuestions = getCorrectQuestionsCount(ques, solutions);
    const incorrectQuestions = getIncorrectQuestionCount(ques, solutions);

    let marksObtained =
      test.marksPerQuestion * correctQuestions -
      Number(test.negativeMarking) * incorrectQuestions;

    // updating the record
    const updateStatus = await recordModel.updateOne(
      { userId, testName },
      {
        $set: {
          solutions: solutions,
          marksObtained,
        },
      }
    );
    if (!updateStatus.modifiedCount) {
      const err = new Error("Nothing update");
      throw err;
    }

    res.json({ success: true, message: "Record updated successfully" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const recordResponses = async (req, res) => {
  try {
    // getting the user id from request
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    // finding user in the database
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // getting test name from url
    const testNameFromUrl = req.params.testName;

    // getting the data
    const { testName, solutions } = req.body;

    if (!testName || solutions.length == 0 || testName != testNameFromUrl) {
      const err = new Error("Invalid test name provided | Solution not found");
      throw err;
    }

    // finding the test in database
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error("No such test found");
      throw err;
    }

    // checking previous record
    const prev_record = await recordModel.findOne({ userId, testName });
    if (prev_record) {
      const err = new Error("Previous record found");
      throw err;
    }

    // saving the record
    const saveRecord = new recordModel({
      userId,
      testName,
      solutions,
      marksObtained: 0,
    });
    await saveRecord.save();

    res.json({ success: true, message: "Records added successfully." });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const sendResult = async (req, res) => {
  try {
    // getting the user id from request
    const userId = req.userId;
    if (!userId) {
      const err = new Error("Invalid user");
      throw err;
    }

    // finding user in the database
    const user = await authModel.findOne({ _id: userId });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // getting test name from url
    const testName = req.params.testName;

    if (!testName) {
      const err = new Error("Invalid test name provided");
      throw err;
    }

    // finding the test in database
    const test = await testModel.findOne({ testName });
    if (!test) {
      const err = new Error("No such test found");
      throw err;
    }

    // getting the questions for the test
    const questions = await questionModel.findOne({ testName });
    if (!questions) {
      const err = new Error("No such test found");
      throw err;
    }

    // getting the user's answers for the test
    const userans = await recordModel.findOne({
      userId: userId,
      testName: testName,
    });
    if (!userans) {
      const err = new Error("first give the test");
      throw err;
    }

    const data = {
      ques: questions.question,
      ans: userans.solutions,
      testDetails: test,
    };

    res.json({ success: true, message: "result was successfully sent.", data });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
