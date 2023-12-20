import Razorpay from "razorpay";
import { nanoid } from "nanoid";
import { orderModel } from "../models/orders.model.js";
import { genObjectId } from "../utils/genId.mongodb.js";
import { authModel } from "../models/auth.model.js";

export const createOrder = async (req, res) => {
  try {
    // getting the user's details
    const { firstName, lastName, email, mobileNumber } = req.body;
    const userFound = await authModel.findOne({
      firstName,
      lastName,
      email,
      mobileNumber,
    });
    if (userFound) {
      const err = new Error("User already registered");
      throw err;
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const payment_capture = 1;
    const amount = 50;
    const currency = "INR";
    const order_id = nanoid();
    const options = {
      amount: (amount * 100).toString(),
      currency,
      receipt: order_id,
      payment_capture,
    };

    const response = await razorpay.orders.create(options);

    // saving the order
    let userId = await genObjectId();
    while (
      await orderModel.findOne({
        customerId: userId,
      })
    ) {
      userId = await genObjectId();
    }

    const order = new orderModel({
      customerId: userId,
      orderId: response.id,
    });
    await order.save();

    res.json({
      success: true,
      message: "Order created",
      orderResponse: {
        id: response.id,
        currency: response.currency,
        amount: response.amount,
        userId,
      },
    });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};
