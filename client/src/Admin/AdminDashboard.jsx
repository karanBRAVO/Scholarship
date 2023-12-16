import { useDispatch, useSelector } from "react-redux";
import { resetAdminData } from "../store/features/adminSlice.js";
import Admin_addTest from "./Admin_addTest";
import Admin_getTestDetails from "./Admin_getTestDetails.jsx";
import Admin_addQuestions from "./Admin_addQuestions";
import PreviewWindow from "./PreviewWindow.jsx";
import { useState } from "react";

const AdminDashboard = () => {
  const adminStatus = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  const [selectedTab, setSelectedTab] = useState("addTest");
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (text) => {
    simulateLoading();
    setSelectedTab(text);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    dispatch(resetAdminData());
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen text-black">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex flex-col items-center justify-between py-4 border-r border-white">
        <div>
          <h2 className="text-2xl font-black mb-4 text-black">
            Admin Dashboard
          </h2>
          <hr className="h-1 bg-white m-2 mb-4" />
          <ul className="space-y-2">
            <li
              className={`rounded-md shadow-md p-2 cursor-pointer ${
                selectedTab === "addQuestions" ? "bg-slate-400" : ""
              }`}
              onClick={() => {
                handleClick("addQuestions");
              }}
            >
              <span className="text-base text-black font-mono">
                Add Questions
              </span>
            </li>
            <li
              className={`rounded-md shadow-md p-2 cursor-pointer ${
                selectedTab === "addTest" ? "bg-slate-400" : ""
              }`}
              onClick={() => {
                handleClick("addTest");
              }}
            >
              <span className="text-base text-black font-mono">Add Test</span>
            </li>
            <li
              className={`rounded-md shadow-md p-2 cursor-pointer ${
                selectedTab === "getTestDetails" ? "bg-slate-400" : ""
              }`}
              onClick={() => {
                handleClick("getTestDetails");
              }}
            >
              <span className="text-base text-black font-mono">
                Get Test Details
              </span>
            </li>
            <li
              className={`rounded-md shadow-md p-2 cursor-pointer ${
                selectedTab === "previewWindow" ? "bg-slate-400" : ""
              }`}
              onClick={() => {
                handleClick("previewWindow");
              }}
            >
              <span className="text-base text-black font-mono">
                Preview Window
              </span>
            </li>
          </ul>
        </div>
        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 animate-pulse fixed top-2 right-4"
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
        <h1 className="text-3xl font-semibold mb-8">Welcome, Admin!</h1>
        <p>Click on the links in the sidebar to manage questions and tests.</p>
        <div className="p-1 m-1 bg-blue-400 w-fit rounded-md">
          <h3>
            Username: <span>{adminStatus.username}</span>
          </h3>
        </div>

        <hr className="h-1 bg-black" />

        <div className="max-h-screen overflow-auto">
          {isLoading ? (
            <div className="fixed z-10 top-1/2 left-1/2">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-blue-500 border-r-2 border-b-2"></div>
            </div>
          ) : (
            <div>
              {selectedTab === "addQuestions" ? (
                <Admin_addQuestions />
              ) : selectedTab === "addTest" ? (
                <Admin_addTest />
              ) : selectedTab === "getTestDetails" ? (
                <Admin_getTestDetails />
              ) : (
                <PreviewWindow />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
