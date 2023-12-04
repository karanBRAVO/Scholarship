import express from "express";
import { userSignup, userLogin } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/user-signup", userSignup);
router.post("/user-login", userLogin);

export default router;
