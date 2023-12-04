import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      trim: true,
    },
    orderId: {
      type: String,
      required: true,
      trim: true,
    },
    paymentId: {
      type: String,
      default: "not_done_payment",
      required: true,
      trim: true,
    },
    paymentSignature: {
      type: String,
      default: "not_done_payment",
      required: true,
      trim: true,
    },
    success: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timeseries: true, timestamps: true }
);

export const orderModel = new mongoose.model("order", orderSchema);
