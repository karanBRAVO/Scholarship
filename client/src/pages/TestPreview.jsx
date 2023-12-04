import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
} from "../utils/notifier.js";
import axios from "axios";
import { resetUserAnsState, updateTimer } from "../store/features/userAns.js";

const TestPreview = ({ TestName }) => {
  const loginStatus = useSelector((state) => state.login);
  const userSolutions = useSelector((state) => state.userAns);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { testName } = useParams();

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const formattedTime = `${String(hrs).padStart(2, "0")}:${String(
      mins
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    return formattedTime;
  };

  const getVisitedCount = () => {
    let c = 0;
    for (let i = 0; i < userSolutions.solutions.length; i++) {
      if (userSolutions.solutions[i].visitedFlag) {
        c++;
      }
    }
    return c;
  };

  const getAnsweredCount = () => {
    let c = 0;
    for (let i = 0; i < userSolutions.solutions.length; i++) {
      if (
        userSolutions.solutions[i].visitedFlag &&
        userSolutions.solutions[i].optionId != null
      ) {
        c++;
      }
    }
    return c;
  };

  const info = {
    totalQuestions: userSolutions.solutions.length,
    answered: getAnsweredCount(),
    visited: getVisitedCount(),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updateTimer());
    }, 1000);

    if (userSolutions.timer == 0) {
      handleTestSubmit();
    }

    return () => clearInterval(interval);
  }, []);

  const handleTestSubmit = async () => {
    const accessToken = loginStatus.token;

    if (accessToken) {
      try {
        const res = await axios.post(
          `/api/${testName}/submit-test`,
          {
            testName: userSolutions.testName,
            solutions: userSolutions.solutions,
          },
          { headers: { Authorization: "Bearer " + accessToken } }
        );

        if (res.data.success) {
          sendSuccessMessage("Test submitted!");
          navigate(`/${testName}-result`);
          dispatch(resetUserAnsState());
        } else {
          sendInfoMessage("Cannot submit the test");
        }
      } catch (error) {
        sendErrorMessage("Error submitting");
      }
    } else {
      sendInfoMessage("You are not authenticated");
    }
  };

  const handleTestUnsubmit = (
    testname,
    totalQuestions,
    marksPerQuestion,
    negativeMarking,
    timeAvailable
  ) => {
    navigate(
      `/${testname}-quiz/total-questions-/${totalQuestions}/marks-per-question-/${marksPerQuestion}/negative-marking-/${negativeMarking}/time-available-/${timeAvailable}`
    );
  };

  return (
    <div className="flex flex-col gap-5 bg-gray-800 text-white p-6 min-h-screen">
      <div className="bg-blue-500 p-4 font-semibold">
        <p>Test Name: {TestName}</p>
        <p>Welcome: {loginStatus.firstName + " " + loginStatus.lastName}</p>
        <p>{loginStatus.email}</p>
      </div>
      <div className="mt-4 flex justify-between p-4 text-xs">
        <p>Subject: {testName}</p>
        <p>
          Time Left:{" "}
          <span className="bg-yellow-400 px-2">
            {userSolutions.timer ? formatTime(userSolutions.timer) : "00:00:00"}
          </span>{" "}
        </p>
      </div>
      <div className="mx-auto max-w-md ">
        <table className="table-auto w-full border">
          <thead>
            <tr>
              <th className="bg-gray-600 border px-4 py-2 text-left">
                English
              </th>
              <th className="bg-gray-600 border px-4 py-2 text-left">
                Details
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Total Questions</td>
              <td className="border px-4 py-2">{info.totalQuestions}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Answered</td>
              <td className="border px-4 py-2">{info.answered}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Not Answered</td>
              <td className="border px-4 py-2">
                {info.totalQuestions - info.answered}
              </td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Visited</td>
              <td className="border px-4 py-2">{info.visited}</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Not Visited</td>
              <td className="border px-4 py-2">
                {info.totalQuestions - info.visited}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center flex flex-col gap-4 mt-4">
        <p>Do you want to Submit Test?</p>
        <div className="flex justify-center gap-8">
          <button
            type="button"
            className="bg-green-600 text-white px-6 py-2 rounded"
            onClick={handleTestSubmit}
          >
            Yes
          </button>
          <button
            type="button"
            className="bg-red-600 text-white px-6 py-2 rounded"
            onClick={() => {
              handleTestUnsubmit(
                testName,
                userSolutions.totalQuestions,
                userSolutions.marksPerQuestion,
                userSolutions.negativeMarking,
                userSolutions.timeAvailable
              );
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPreview;
