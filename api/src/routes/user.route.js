import express from "express";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  canGiveTest,
  getAvailableTests,
  getQuestions,
} from "../controllers/user.contoller.js";

const router = express.Router();

router.get("/can-give-test/:testName", authenticateUser, canGiveTest);
router.get("/get-test-details", authenticateUser, getAvailableTests);
router.post("/get-questions", authenticateUser, getQuestions);

export default router;
