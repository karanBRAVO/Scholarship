import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";

const Admin_getTestDetails = () => {
  const adminStatus = useSelector((state) => state.admin);

  const [isLoading, setIsLoading] = useState(false);
  const [testName, setTestName] = useState("");
  const [details, setDetails] = useState(null);
  const [sortedStudents, setSortedStudents] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = adminStatus.token;
    if (testName.length > 0 && token.length > 0) {
      try {
        const res = await axios.get(`/api/admin/get-test-details/${testName}`, {
          headers: { Authorization: "Bearer " + token },
        });

        if (res.data.success) {
          sendSuccessMessage("Details fetched successfully");
          let userDatas = [];
          res.data.data.usersDetails.forEach((userData, index) => {
            // finding the users result
            let user_result = res.data.data.usersResults.find((record) => {
              return record.userId === userData.userId;
            });
            userDatas.push({
              name: !user_result
                ? userData.name + " (NOT_GIVEN)"
                : userData.name,
              email: userData.email,
              phone: userData.mobileNumber,
              marks: !user_result ? 0 : user_result.marks,
            });
          });
          setSortedStudents(userDatas);
          setDetails(res.data.data);
        } else {
          sendInfoMessage(res.data.error);
        }
      } catch (error) {
        sendErrorMessage("Error while fetching data");
      }
    } else {
      sendWarningMessage("Test name is required");
    }

    setIsLoading(false);
  };

  const handleChange = (e) => {
    setTestName(e.target.value);
  };

  const handleSort = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortedStudents(
      [...sortedStudents].sort((a, b) =>
        sortOrder === "asc" ? a.marks - b.marks : b.marks - a.marks
      )
    );
    setSortOrder(newOrder);
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="textInput" className="text-gray-600">
            Enter Text:
          </label>
          <input
            type="text"
            id="textInput"
            autoComplete="off"
            value={testName}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md focus:outline-none focus:border-blue-500"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md hover:bg-blue-600"
          >
            {isLoading ? (
              <div className="flex flex-row items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-white border-r-2 border-b-2"></div>
                <p className="text-white">Loading ...</p>
              </div>
            ) : (
              <span>Get Details</span>
            )}
          </button>
        </form>
      </div>

      {details ? (
        <>
          <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-md shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Test Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="text-gray-600">Test Name:</label>
                <p className="text-black">{details.testDetails.testName}</p>
              </div>
              <div className="mb-4">
                <label className="text-gray-600">Total Questions:</label>
                <p className="text-black">
                  {details.testDetails.totalQuestions}
                </p>
              </div>
              <div className="mb-4">
                <label className="text-gray-600">Marks Per Question:</label>
                <p className="text-black">
                  {details.testDetails.marksPerQuestion}
                </p>
              </div>
              <div className="mb-4">
                <label className="text-gray-600">Negative Marking:</label>
                <p className="text-black">
                  {details.testDetails.negativeMarking ? "Enabled" : "Disabled"}
                </p>
              </div>
              <div className="mb-4">
                <label className="text-gray-600">Time Available:</label>
                <p className="text-black">
                  {details.testDetails.timeAvailable}
                </p>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-8">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              Student Information
            </h2>
            <p className="text-sm text-slate-400 m-1 p-2">
              *Click the headings to sort
            </p>
            <table className="min-w-full bg-white border border-gray-300 rounded-md overflow-hidden">
              <thead className="bg-gray-200">
                <tr>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={handleSort}
                  >
                    S.No.
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={handleSort}
                  >
                    Name
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={handleSort}
                  >
                    Email
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={handleSort}
                  >
                    Phone
                  </th>
                  <th
                    className="py-2 px-4 border-b cursor-pointer"
                    onClick={handleSort}
                  >
                    Marks
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "bg-gray-100" : ""}
                  >
                    <td className="py-2 px-4 border-b">{index + 1}</td>
                    <td className="py-2 px-4 border-b">{student.name}</td>
                    <td className="py-2 px-4 border-b">{student.email}</td>
                    <td className="py-2 px-4 border-b">{student.phone}</td>
                    <td className="py-2 px-4 border-b">{student.marks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="m-1 p-1 text-sm text-slate-500">
          Enter test name to get the details
        </p>
      )}
    </div>
  );
};

export default Admin_getTestDetails;
