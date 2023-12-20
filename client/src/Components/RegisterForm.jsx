import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  sendSuccessMessage,
  sendInfoMessage,
  sendErrorMessage,
} from "../utils/notifier.js";
import { initializeRazorpay } from "../RazorpayPayment/Razorpay.initializepayment.js";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    paymentError: "",
  });

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

    //validate mobile number
    if (formData.mobileNumber.length !== 10) {
      newErrors.password = "Mobile number should be of 10 digit";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Validate password length
    if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      isValid = false;
    } else {
      newErrors.password = "";
    }

    // Validate password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePayment = async () => {
    try {
      const isInitialized = await initializeRazorpay();
      if (!isInitialized) {
        const error = new Error("Falied to initialize the RazorPay");
        throw error;
      }

      const res = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/payment-gateway/create-order/quiz-app`,
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
        }
      );

      const userId = res.data.orderResponse.userId;

      let options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        name: "Scholarship",
        currency: res.data.orderResponse.currency,
        amount: res.data.orderResponse.amount,
        order_id: res.data.orderResponse.id,
        description: "This is scholarship app payment",
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMIC3apFP9-9hghtlDJWO_pR5DZpoq3aO4Bw&usqp=CAU",
        handler: async (response) => {
          await registerUser(response, userId);
        },
        prefill: {
          name: formData.firstName + " " + formData.lastName,
          email: formData.email,
          contact: formData.mobileNumber,
        },
        notes: {
          note: "payment using Razorpay gateway",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const paymentObject = new window.Razorpay(options);

      paymentObject.open();

      paymentObject.on("payment.failed", (error) => {
        console.error(error);
        sendErrorMessage("Payment failed");
      });
    } catch (error) {
      sendErrorMessage("Failed to get the pop up for payment");
    }
    return false;
  };

  const registerUser = async (checkout_result, userId) => {
    try {
      // registering the user
      const data = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        orderId: checkout_result.razorpay_order_id,
        paymentId: checkout_result.razorpay_payment_id,
        paymentSignature: checkout_result.razorpay_signature,
        userId: userId,
      };
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/user-signup`,
        data
      );

      if (res.data.success) {
        sendSuccessMessage(res.data.message);
        sendInfoMessage("Now you can login");
        navigate("/login");
      } else {
        sendErrorMessage(res.data.error);
      }
    } catch (error) {
      sendErrorMessage("Failed to register user");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      await handlePayment();
    } else {
      sendInfoMessage("Form Validation failed");
    }

    setLoading(false);
  };

  return (
    <form className="flex flex-col gap-2 p-1.5" onSubmit={handleSubmit}>
      <label htmlFor="firstName">
        First Name: <span className="text-red-500">*</span>{" "}
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={formData.firstName}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.firstName}</div>
      </label>
      <label htmlFor="lastName">
        Last Name: <span className="text-red-500">*</span>{" "}
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={formData.lastName}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.lastName}</div>
      </label>
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
      <label htmlFor="mobileNumber">
        Mobile Number: <span className="text-red-500">*</span>{" "}
        <input
          type="number"
          name="mobileNumber"
          id="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.mobileNumber}</div>
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
      <label htmlFor="confirmPassword">
        Confirm Password: <span className="text-red-500">*</span>{" "}
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          autoComplete="off"
          className="border border-black w-full p-1.5 rounded-lg hover:shadow-lg"
          required
        />
        <div className="text-red-500">{errors.confirmPassword}</div>
      </label>
      <div className="text-red-500">{errors.paymentError}</div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 disabled:bg-blue-300 m-auto p-2 text-xl text-white rounded-xl disabled:cursor-progress"
      >
        {loading ? (
          <span>Loading ...</span>
        ) : (
          <span>Register with Payment</span>
        )}
      </button>
    </form>
  );
};

export default Register;
