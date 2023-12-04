import express from "express";
import { adminLogin } from "../controllers/adminAuth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";
import {
  addQuestions,
  addTestDetails,
} from "../controllers/adminFunc.controller.js";

const router = express.Router();

router.post("/admin/login", adminLogin);
// router.post("/admin/register", adminSignup);

router.post("/admin/add-test-details", authenticateUser, addTestDetails);
router.post("/admin/add-question", authenticateUser, addQuestions);

export default router;
