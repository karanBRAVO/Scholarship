import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import ProfileDropdown from "../Components/ProfileDropdown";
import { resetUserData } from "../store/features/loginSlice";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { sendErrorMessage, sendInfoMessage } from "../utils/notifier.js";
import Loading from "../Components/Loading.jsx";
import { resetUserAnsState } from "../store/features/userAns.js";

const TestResult = ({ TestName }) => {
  const { testName } = useParams();
  const loginStatus = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [testDetails, setTestDetails] = useState({});
  const [userTestResult, setUserTestResult] = useState({
    testName: testName,
    totalQuestions: 0,
    marksPerQuestion: 0,
    attemptedQuestions: 0,
    visitedQuestions: 0,
    correctQuestions: 0,
    incorrectQuestions: 0,
    negativeMarking: false,
    timeAvailable: "",
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const colorPack = {
    attempted: "#00ff00",
    visited: "#ffff00",
    default: "#94a3b8",
  };

  useEffect(() => {
    dispatch(resetUserAnsState());

    const getVisitedQuestionsCount = (answersArray) => {
      let c = 0;
      answersArray.forEach((value, index) => {
        if (value.visitedFlag) {
          c++;
        }
      });
      return c;
    };

    const getAttemptedQuestionsCount = (answersArray) => {
      let c = 0;
      answersArray.forEach((value, index) => {
        if (value.optionId && value.visitedFlag) {
          c++;
        }
      });
      return c;
    };

    const getCorrectQuestionsCount = (questionsArray, answersArray) => {
      let c = 0;
      questionsArray.forEach((question, index) => {
        if (
          String(
            question.questionOption.find((option) => option.isCorrect)._id
          ) ===
          answersArray.find(
            (record) => record.questionId === String(question._id)
          ).optionId
        ) {
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

    const getResult = async () => {
      const token = loginStatus.token;

      if (token) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/api/${testName}/get-result`,
            {
              headers: { Authorization: "Bearer " + token },
            }
          );

          if (res.data.success) {
            setAnswers(res.data.data.ans);
            setQuestions(res.data.data.ques);
            setTestDetails(res.data.data.testDetails);

            setUserTestResult((prev) => {
              return {
                ...prev,
                totalQuestions: res.data.data.ques.length,
                attemptedQuestions: getAttemptedQuestionsCount(
                  res.data.data.ans
                ),
                marksPerQuestion: res.data.data.testDetails.marksPerQuestion,
                visitedQuestions: getVisitedQuestionsCount(res.data.data.ans),
                negativeMarking: res.data.data.testDetails.negativeMarking,
                correctQuestions: getCorrectQuestionsCount(
                  res.data.data.ques,
                  res.data.data.ans
                ),
                incorrectQuestions: getIncorrectQuestionCount(
                  res.data.data.ques,
                  res.data.data.ans
                ),
                timeAvailable: res.data.data.testDetails.timeAvailable,
              };
            });
          } else {
            sendInfoMessage("Error while getting the result");
            navigate("/test-dashboard");
          }
        } catch (error) {
          sendErrorMessage("Error while getting result");
        }
      } else {
        sendInfoMessage("You are not authorized");
      }
    };

    getResult();
  }, []);

  const getOptionColor = (optionId, marked_optionId, isCorrectOption) => {
    if (optionId === marked_optionId && !isCorrectOption) {
      return "#ff0000";
    }
    if (isCorrectOption) {
      return "#00ffff";
    }
    return "#ffffff";
  };

  const getQuestionColor = (solution) => {
    if (solution.visitedFlag && solution.optionId != null) {
      return "#00ff00";
    }
    if (solution.visitedFlag) {
      return "#ffff00";
    }
    return "#ffffff";
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(resetUserData());
  };

  const handleDeleteAccount = () => {};

  const moveToDashboard = () => {
    navigate("/test-dashboard");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="container mx-auto py-8">
        <div className="flex flex-col items-center justify-center md:flex-row">
          <img src={logo} alt="Logo" className="w-full md:w-1/5 mb-5 md:mb-0" />
          <h1>{TestName}</h1>
          <div className="mt-5 md:ml-5 md:mt-0">
            <button
              className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 m-1"
              type="button"
              onClick={handleToggleDropdown}
            >
              Profile
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {isDropdownOpen ? (
              <ProfileDropdown
                name={loginStatus.firstName + " " + loginStatus.lastName}
                email={loginStatus.email}
                phone={loginStatus.mobileNumber}
                regd={loginStatus.registeredAt}
                handleLogout={handleLogout}
                handleDelAccount={handleDeleteAccount}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>

      <div className="text-xs mt-10 p-2 flex flex-col gap-2 text-gray-800 dark:text-gray-200">
        <p className="text-gray-600 dark:text-gray-300 font-semibold">
          Dnyanankur Publication {" > "} Test Center {" > "} Mock Test {" > "}
          Test Details
        </p>
        <p className="font-bold text-base">Test Details</p>
        <hr className="h-1 w-full bg-slate-50" />
        <div className="mx-auto max-w-md overflow-x-auto">
          <table className="table-auto w-full border dark:border-gray-600">
            <thead>
              <tr>
                <th className="bg-gray-200 border px-4 py-2 text-left dark:bg-gray-300 text-black">
                  Fields
                </th>
                <th className="bg-gray-200 border px-4 py-2 text-left dark:bg-gray-300 text-black">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Name</td>
                <td className="border px-4 py-2">{userTestResult.testName}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Duration</td>
                <td className="border px-4 py-2">
                  {userTestResult.timeAvailable}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Total Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.totalQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Total Marks</td>
                <td className="border px-4 py-2">
                  {userTestResult.marksPerQuestion *
                    userTestResult.totalQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Marks Per Question</td>
                <td className="border px-4 py-2">
                  {userTestResult.marksPerQuestion}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Negative Marking</td>
                <td className="border px-4 py-2">
                  {userTestResult.negativeMarking ? (
                    <span>-1</span>
                  ) : (
                    <span>No negative marking</span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">marks Obtained</td>
                <td className="border px-4 py-2">
                  {userTestResult.marksPerQuestion *
                    userTestResult.correctQuestions -
                    userTestResult.negativeMarking *
                      userTestResult.incorrectQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Attempted Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.attemptedQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Correct Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.correctQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">InCorrect Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.incorrectQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Un-Attempted Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.totalQuestions -
                    userTestResult.attemptedQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Visited Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.visitedQuestions}
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Not-Visited Questions</td>
                <td className="border px-4 py-2">
                  {userTestResult.totalQuestions -
                    userTestResult.visitedQuestions}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex flex-col md:flex-row gap-3 justify-end my-5">
          <button
            type="button"
            className="p-1 text-base bg-gray-200 border-b-black border shadow-md text-black w-fit"
            onClick={moveToDashboard}
          >
            Back
          </button>
        </div>
      </div>

      <div className="flex items-start justify-center flex-col md:flex-row">
        <div className="flex flex-row m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill={colorPack.attempted} />
          </svg>
          <span className="text-white">Attempted</span>
        </div>
        <div className="flex flex-row m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill={colorPack.visited} />
          </svg>
          <span className="text-white">Visited</span>
        </div>
        <div className="flex flex-row m-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-6 h-6 mr-2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" fill={colorPack.default} />
          </svg>
          <span className="text-white">Not Visited</span>
        </div>
      </div>

      <div className="mt-8 p-2 md:p-5">
        {!questions && !answers ? (
          <Loading />
        ) : (
          <>
            {questions.map((question, q_index) => (
              <div
                key={q_index}
                className="mt-4 border p-4 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 text-gray-700 dark:text-gray-300"
              >
                <h3 className="text-lg font-semibold mb-2">
                  <span className="flex flex-row gap-2 items-center justify-center">
                    {q_index + 1 + ". "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="w-6 h-6 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        fill={getQuestionColor(
                          answers.find(
                            (record) =>
                              record.questionId === String(question._id)
                          )
                        )}
                      />
                    </svg>
                  </span>
                  <span
                    dangerouslySetInnerHTML={{ __html: question.questionText }}
                  />
                </h3>
                <ul className="list-disc pl-6">
                  {question.questionOption.map((option, option_index) => (
                    <li
                      key={option_index}
                      style={{
                        color: getOptionColor(
                          option._id,
                          answers.find(
                            (record) =>
                              record.questionId === String(question._id)
                          ).optionId,
                          option.isCorrect
                        ),
                        marginLeft: "8px",
                      }}
                    >
                      <span>{option.answerText}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TestResult;
