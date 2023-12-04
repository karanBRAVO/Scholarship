import express from "express";
import { createOrder } from "../controllers/payment.contoller.js";

const router = express.Router();

router.post("/payment-gateway/create-order/quiz-app", createOrder);

export default router;
