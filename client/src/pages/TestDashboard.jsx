import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import ProfileDropdown from "../Components/ProfileDropdown";
import { resetUserData } from "../store/features/loginSlice.js";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";
import Loading from "../Components/Loading.jsx";
import {
  checkGreaterTime,
  getAvailableTime,
  getLocaleTime,
} from "../utils/ZuluFormat.js";
import { resetUserAnsState } from "../store/features/userAns.js";

const TestDashboard = ({ TestName }) => {
  const loginStatus = useSelector((state) => state.login);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [testDetail, setTestDetail] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOnStart = async (
    testname,
    totalQuestions,
    marksPerQuestion,
    negativeMarking,
    timeAvailable
  ) => {
    setIsLoading(true);

    if (window.confirm("Do You want to start exam?")) {
      const token = loginStatus.token;

      if (token && token.length > 0) {
        try {
          const res = await axios.get(`/api/can-give-test/${testname}`, {
            headers: { Authorization: "Bearer " + token },
          });

          if (res.data.success) {
            sendSuccessMessage("Eligible For Test");
            navigate(
              `/${testname}-quiz/total-questions-/${totalQuestions}/marks-per-question-/${marksPerQuestion}/negative-marking-/${negativeMarking}/time-available-/${timeAvailable}`
            );
          } else {
            sendWarningMessage(res.data.error);
            navigate(`/${testname}-result`);
          }
        } catch (error) {
          sendErrorMessage("Error");
        }
      } else {
        sendInfoMessage("Not authenticated");
      }
    }

    setIsLoading(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    dispatch(resetUserData());
  };

  const handleDeleteAccount = () => {};

  useEffect(() => {
    const getTestDetails = async () => {
      dispatch(resetUserAnsState());

      const token = loginStatus.token;
      if (token) {
        try {
          const res = await axios.get("/api/get-test-details", {
            headers: {
              Authorization: "Bearer " + token,
            },
          });

          if (res.data.success) {
            setTestDetail(res.data.tests);
          } else {
            sendInfoMessage("No test details found");
          }
        } catch (error) {
          sendErrorMessage("Couldn't get test details");
        }
      }
    };

    getTestDetails();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center w-screen h-screen bg-slate-950">
          <div className="flex items-center justify-between gap-2 flex-col p-3">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
            <p className="m-1 p-1 text-slate-500 text-sm">
              Checking if you are allowed to give the exam
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 text-white min-h-screen">
          <div className="container mx-auto p-4 sm:p-8">
            <div className="flex flex-col items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-2/3 sm:w-1/3 md:w-1/4 lg:w-1/5 m-auto"
              />
              <div className="m-1">{TestName}</div>
              <div className="mt-4">
                <button
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
              <hr className="h-1 bg-white w-full my-4" />
            </div>

            <div className="text-sm mt-6 p-4 flex flex-col gap-4">
              <p className="text-green-400 font-semibold">
                Dnyanankur Publication {" > "} Test Center {" > "} Mock Test{" "}
                {" > "} Test Details
              </p>
              <p className="font-bold text-lg">Test Preview</p>

              {!testDetail ? (
                <Loading />
              ) : (
                testDetail.map((test, index) => {
                  return (
                    <div
                      className="bg-gray-800 p-4 rounded shadow-md"
                      key={index}
                    >
                      {checkGreaterTime(test.timings.endTime) ? (
                        checkGreaterTime(test.timings.startTime) ? (
                          <h1 className="m-1 p-1">
                            <span className="font-bold text-green-400 uppercase text-xl font-sans">
                              NOT YET STARTED{" "}
                              <span className="text-sm p-1 m-1 text-yellow-600">
                                starts in{" "}
                                {getAvailableTime(
                                  new Date(),
                                  test.timings.startTime
                                )}
                              </span>
                            </span>
                          </h1>
                        ) : (
                          <h1 className="m-1 p-1">
                            <span className="font-bold text-green-400 uppercase text-xl font-sans">
                              RUNNING...
                              <span className="text-sm p-1 m-1 text-yellow-600">
                                ends in{" "}
                                {getAvailableTime(
                                  new Date(),
                                  test.timings.endTime
                                )}
                              </span>
                            </span>
                          </h1>
                        )
                      ) : (
                        <h1 className="m-1 p-1">
                          <span className="font-bold text-red-400 uppercase text-xl font-sans">
                            ! ENDED
                          </span>
                        </h1>
                      )}
                      <ul className="list-disc pl-4 capitalize">
                        <li>
                          <span className="font-bold">Test Name:</span>{" "}
                          {test.testName}
                        </li>
                        <li>
                          <span className="font-bold">Total Questions:</span>{" "}
                          {test.totalQuestions}
                        </li>
                        <li>
                          <span className="font-bold">Marks/question:</span>{" "}
                          {test.marksPerQuestion}
                        </li>
                        <li>
                          <span className="font-bold">total Marks:</span>{" "}
                          {test.totalQuestions * test.marksPerQuestion}
                        </li>
                        <li>
                          <span className="font-bold">Negative Marking:</span>{" "}
                          {test.negativeMarking ? (
                            <p>Negative marking (-1)</p>
                          ) : (
                            <p>No negative marking</p>
                          )}
                        </li>
                        <li>
                          <span className="font-bold">
                            Time available {`(hrs:min:sec)`}:
                          </span>{" "}
                          {test.timeAvailable}
                        </li>
                        <li>
                          <span className="font-bold text-purple-400">
                            Start on {`(YYYY-MM-DDTHH:MM:SSZ)`}:
                          </span>{" "}
                          {getLocaleTime(test.timings.startTime)}
                        </li>
                        <li>
                          <span className="font-bold text-purple-400">
                            Ends on {`(YYYY-MM-DDTHH:MM:SSZ)`}:
                          </span>{" "}
                          {getLocaleTime(test.timings.endTime)}
                        </li>
                      </ul>

                      <div className="flex flex-col sm:flex-row justify-center sm:justify-end mt-6">
                        <button
                          type="button"
                          disabled={
                            !checkGreaterTime(test.timings.endTime) ||
                            checkGreaterTime(test.timings.startTime)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-2 sm:mb-0 sm:mr-4 disabled:cursor-not-allowed"
                          onClick={() => {
                            handleOnStart(
                              test.testName,
                              test.totalQuestions,
                              test.marksPerQuestion,
                              test.negativeMarking,
                              test.timeAvailable
                            );
                          }}
                        >
                          Start Exam
                        </button>
                        <button
                          type="button"
                          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                        >
                          <Link to="/test-dashboard">Re-Test</Link>
                        </button>
                      </div>

                      <div className="text-gray-300 text-sm mt-4">
                        <p>* make sure you have read the instructions</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TestDashboard;
