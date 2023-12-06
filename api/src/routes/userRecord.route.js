import express from "express";
import {
  recordResponses,
  sendResult,
  updateResponses,
} from "../controllers/userRecord.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/:testName/submit-test", authenticateUser, recordResponses);
router.put("/:testName/update-submit-test", authenticateUser, updateResponses);
router.get("/:testName/get-result", authenticateUser, sendResult);

export default router;
