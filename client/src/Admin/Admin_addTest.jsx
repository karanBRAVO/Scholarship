import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier";

const Admin_addTest = () => {
  const adminStatus = useSelector((state) => state.admin);

  const [formData, setFormData] = useState({
    testName: "",
    totalQuestions: "",
    marksPerQuestion: "",
    negativeMarking: false,
    startDate: "",
    startTime: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
    endDate: "",
    endTime: {
      hours: 0,
      minutes: 0,
      seconds: 0,
    },
  });
  const [isLoading, setIsloading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleStartTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      return {
        ...prevData,
        startTime: {
          ...prevData.startTime,
          [name]: value,
        },
      };
    });
  };

  const handleEndTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      return {
        ...prevData,
        endTime: {
          ...prevData.endTime,
          [name]: value,
        },
      };
    });
  };

  const checkDataValidity = () => {
    Object.keys(formData).forEach((key) => {
      if (key != "timeAvailable" && key != "startTime") {
        if (!formData[key] || formData.length > 0) {
          return false;
        }
      }
    });

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (confirm("Are you sure you want to submit?")) {
      setIsloading(true);

      const token = adminStatus.token;

      if (checkDataValidity() && token.length > 0) {
        try {
          const res = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/admin/add-test-details`,
            {
              testName: formData.testName,
              totalQuestions: formData.totalQuestions,
              marksPerQuestion: formData.marksPerQuestion,
              negativeMarking: formData.negativeMarking,
              endTime: getFullDateTime("endTime", "endDate"),
              startTime: getFullDateTime("startTime", "startDate"),
            },
            {
              headers: { Authorization: "Bearer " + token },
            }
          );

          if (res.data.success) {
            sendSuccessMessage(res.data.message);
            setFormData({
              testName: "",
              totalQuestions: "",
              marksPerQuestion: "",
              negativeMarking: false,
              startDate: "",
              startTime: {
                hours: 0,
                minutes: 0,
                seconds: 0,
              },
              endDate: "",
              endTime: {
                hours: 0,
                minutes: 0,
                seconds: 0,
              },
            });
          } else {
            sendInfoMessage("Error adding test details");
            sendWarningMessage(res.data.error);
          }
        } catch (error) {
          sendErrorMessage("Error");
        }
      } else {
        sendWarningMessage("All are required fields");
      }

      setIsloading(false);
    }
  };

  const getFullDateTime = (Time, Date) => {
    const hours = formData[Time].hours;
    const mins = formData[Time].minutes;
    const secs = formData[Time].seconds;
    const time = `${hours < 10 ? "0" + hours : hours}:${
      mins < 10 ? "0" + mins : mins
    }:${secs < 10 ? "0" + secs : secs}`;
    const date = formData[Date];
    const dateTime = date + "T" + time;
    return dateTime;
  };

  const getMinDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-blue-600">Add Test</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="testName" className="block text-gray-600">
            Test Name:
          </label>
          <input
            type="text"
            id="testName"
            name="testName"
            autoComplete="off"
            value={formData.testName}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="totalQuestions" className="block text-gray-600">
            Total Questions:
          </label>
          <input
            type="number"
            id="totalQuestions"
            name="totalQuestions"
            autoComplete="off"
            value={formData.totalQuestions}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="marksPerQuestion" className="block text-gray-600">
            Marks Per Question:
          </label>
          <input
            type="number"
            id="marksPerQuestion"
            name="marksPerQuestion"
            autoComplete="off"
            value={formData.marksPerQuestion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="flex items-center text-gray-600">
            <input
              type="checkbox"
              id="negativeMarking"
              name="negativeMarking"
              autoComplete="off"
              checked={formData.negativeMarking}
              onChange={handleChange}
              className="mr-2"
            />
            Allow Negative Marking
          </label>
        </div>

        <div className="mb-4">
          <label htmlFor="starting" className="text-gray-600 flex flex-row">
            Starting Time:
            <span className="flex items-center px-2 text-gray-600 text-sm">
              YYYY-MM-DDTHH:MM:SSZ
            </span>
          </label>
          <div className="flex flex-col">
            <span className="flex items-center px-2 text-gray-600 text-sm">
              Start Date
            </span>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              id="startTime"
              autoComplete="off"
              min={getMinDate()}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <span className="flex items-center px-2 text-gray-600 text-sm">
            Start Time
          </span>
          <div className="flex m-1">
            <input
              type="number"
              id="starthours"
              name="hours"
              value={formData.startTime.hours}
              onChange={handleStartTimeChange}
              min="0"
              max="23"
              maxLength={2}
              className="w-1/4 px-4 py-2 border rounded-l-md focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">hrs</span>
            <input
              type="number"
              id="startminutes"
              name="minutes"
              value={formData.startTime.minutes}
              onChange={handleStartTimeChange}
              min="0"
              max="59"
              maxLength={2}
              className="w-1/4 px-4 py-2 border focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">min</span>
            <input
              type="number"
              id="startseconds"
              name="seconds"
              value={formData.startTime.seconds}
              onChange={handleStartTimeChange}
              min="0"
              max="59"
              maxLength={2}
              className="w-1/4 px-4 py-2 border rounded-r-md focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">sec</span>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="ending" className="text-gray-600 flex flex-row">
            End Time:
            <span className="flex items-center px-2 text-gray-600 text-sm">
              YYYY-MM-DDTHH:MM:SSZ
            </span>
          </label>
          <div className="flex flex-col">
            <span className="flex items-center px-2 text-gray-600 text-sm">
              End Date
            </span>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              id="endDate"
              autoComplete="off"
              min={getMinDate()}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <span className="flex items-center px-2 text-gray-600 text-sm">
            End Time
          </span>
          <div className="flex m-1">
            <input
              type="number"
              id="endHours"
              name="hours"
              value={formData.endTime.hours}
              onChange={handleEndTimeChange}
              min="0"
              max="23"
              maxLength={2}
              className="w-1/4 px-4 py-2 border rounded-l-md focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">hrs</span>
            <input
              type="number"
              id="endminutes"
              name="minutes"
              value={formData.endTime.minutes}
              onChange={handleEndTimeChange}
              min="0"
              max="59"
              maxLength={2}
              className="w-1/4 px-4 py-2 border focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">min</span>
            <input
              type="number"
              id="endseconds"
              name="seconds"
              value={formData.endTime.seconds}
              onChange={handleEndTimeChange}
              min="0"
              max="59"
              maxLength={2}
              className="w-1/4 px-4 py-2 border rounded-r-md focus:outline-none focus:border-blue-500"
              required
            />
            <span className="flex items-center px-2 text-gray-600">sec</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          {isLoading ? (
            <div>
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
            </div>
          ) : (
            <span>Add Test</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default Admin_addTest;
