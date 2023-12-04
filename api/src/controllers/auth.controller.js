import { authModel } from "../models/auth.model.js";
import { ValidateEmail } from "../utils/email.validator.js";
import {
  getHashedPassword,
  comparePassword,
} from "../utils/genHashedPassword.js";
import { generateToken } from "../utils/webToken.js";
import { orderModel } from "../models/orders.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

export const userSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      mobileNumber,
      password,
      orderId,
      paymentId,
      paymentSignature,
      userId,
    } = req.body;
    // validating details
    if (
      firstName.length == 0 ||
      lastName.length == 0 ||
      email.length == 0 ||
      mobileNumber.length == 0 ||
      password.length == 0 ||
      orderId.length == 0 ||
      paymentId.length == 0 ||
      paymentSignature.length == 0 ||
      !ValidateEmail(email) ||
      userId.length == 0
    ) {
      const err = new Error("Invalid details entered");
      throw err;
    }

    // finding user in database
    const getuser = await authModel.findOne({ email });
    if (getuser) {
      const err = new Error("User already exists");
      throw err;
    }

    // getting the order details
    const order = await orderModel.findOne({ customerId: userId });
    if (!order) {
      const err = new Error("No order found");
      throw err;
    }

    // verifying the payment
    if (
      !validatePaymentVerification(
        { order_id: order.orderId, payment_id: paymentId },
        paymentSignature,
        process.env.RAZORPAY_SECRET
      )
    ) {
      const err = new Error(
        "PaymentVerification failed | in case money is debited then contact the administrator"
      );
      throw err;
    }

    // making the order as successful
    await orderModel.updateOne(
      { _id: order._id },
      {
        $set: {
          success: true,
          paymentId,
          paymentSignature,
        },
      }
    );

    // saving user to database
    const hashedPassword = getHashedPassword(password);
    const user = new authModel({
      _id: order.customerId,
      firstName,
      lastName,
      email,
      mobileNumber,
      password: hashedPassword,
    });
    await user.save();

    res.json({ success: true, message: "Signup Successfull" });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    // validating details
    if (email.length == 0 || password.length == 0 || !ValidateEmail(email)) {
      const err = new Error("Invalid details");
      throw err;
    }

    // finding user in database
    const user = await authModel.findOne({ email });
    if (!user) {
      const err = new Error("User not found");
      throw err;
    }

    // matching passwords
    if (!comparePassword(password, user.password)) {
      const err = new Error("User credentials not matched");
      throw err;
    }

    // generating token
    const token = generateToken(user._id);

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      regd: user.createdAt,
      token: token,
    };

    res.json({ success: true, message: "Login Successfull", userData });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
