import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendErrorMessage, sendSuccessMessage } from "../utils/notifier";
import axios from "axios";
import { setUserData } from "../store/features/loginSlice.js";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate each field
    Object.keys(formData).forEach((key) => {
      if (formData[key].trim() === "") {
        newErrors[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
      } else {
        newErrors[key] = "";
      }
    });

    // Validate password length
    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (validateForm()) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/user-login`,
          formData
        );
        if (res.data.success) {
          sendSuccessMessage(res.data.message);
          const userData = res.data.userData;
          dispatch(
            setUserData({
              firstName: userData.firstName,
              lastName: userData.lastName,
              email: userData.email,
              mobileNumber: userData.mobileNumber,
              registeredAt: userData.regd,
              token: userData.token,
            })
          );
          navigate("/test-dashboard");
        } else {
          sendErrorMessage(res.data.error);
        }
      } else {
        throw new Error("Invalid details entered");
      }
    } catch (error) {
      sendErrorMessage("Form Validation Failed");
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-3 p-2" onSubmit={handleSubmit}>
      <label htmlFor="email">
        Email id: <span className="text-red-500">*</span>{" "}
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.email}</div>
      </label>
      <label htmlFor="password">
        Password: <span className="text-red-500">*</span>{" "}
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.password}</div>
      </label>
      <div className="text-center mt-3">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 m-auto p-2 text-xl text-white rounded-xl disabled:cursor-progress disabled:bg-blue-300"
        >
          {loading ? <span>Logging in...</span> : <span>Login</span>}
        </button>
      </div>
    </form>
  );
};

export default Login;
