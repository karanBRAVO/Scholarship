import express from "express";
import {
  recordResponses,
  sendResult,
} from "../controllers/userRecord.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:testName/submit-test", authenticateUser, recordResponses);
router.get("/:testName/get-result", authenticateUser, sendResult);

export default router;
