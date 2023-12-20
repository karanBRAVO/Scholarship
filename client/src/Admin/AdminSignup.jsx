import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";
import { useDispatch } from "react-redux";
import { resetAdminData } from "../store/features/adminSlice.js";
import { useState } from "react";

const AdminSignup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(resetAdminData());

    if (username && password) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/admin/register`,
          {
            username,
            password,
          }
        );

        if (res.data.success) {
          sendSuccessMessage("Successfully registered");
          navigate("/admin-login");
        } else {
          sendInfoMessage(res.data.error);
        }
      } catch (error) {
        sendErrorMessage("Error occurred while submitting");
      }
    } else {
      sendWarningMessage("Username and password are required");
    }

    setLoading(false);
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <form
          className="bg-white p-8 shadow-md rounded-md"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-semibold mb-6">Sign Up</h2>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              autoComplete="off"
              className="w-full px-3 py-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              autoComplete="off"
              className="w-full px-3 py-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:cursor-progress disabled:bg-green-300"
          >
            {loading ? <span>Processing...</span> : <span>Sign up</span>}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminSignup;
