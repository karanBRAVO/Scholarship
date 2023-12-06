import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  sendErrorMessage,
  sendInfoMessage,
  sendSuccessMessage,
  sendWarningMessage,
} from "../utils/notifier.js";
import { useDispatch } from "react-redux";
import { resetAdminData, setAdminData } from "../store/features/adminSlice.js";
import { useState } from "react";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    dispatch(resetAdminData());

    if (username.length > 0 && password.length > 0) {
      try {
        const res = await axios.post("/api/admin/login", {
          username,
          password,
        });

        if (res.data.success) {
          sendSuccessMessage("Successfully Logged in!");
          dispatch(setAdminData({ username: username, token: res.data.token }));
          navigate("/admin-dashboard");
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
          <h2 className="text-2xl font-semibold mb-6">Login</h2>
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
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:cursor-progress disabled:bg-blue-300"
          >
            {loading ? <span>Logging in...</span> : <span>Login</span>}
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
