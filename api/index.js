import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { connectToDatabase } from "./src/connection/db.conn.js";
import authRouter from "./src/routes/auth.route.js";
import adminRouter from "./src/routes/admin.route.js";
import userRouter from "./src/routes/user.route.js";
import userRecordRouter from "./src/routes/userRecord.route.js";
import paymentRouter from "./src/routes/payment.route.js";

// configuring dotenv
dotenv.config();

// connecting to database
connectToDatabase(process.env.MONGO_URI);

// creating express application
const app = express();

// port number
const PORT = process.env.PORT || 9090;

// middlewares
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use("/api", authRouter);
app.use("/api", adminRouter);
app.use("/api", userRouter);
app.use("/api", userRecordRouter);
app.use("/api", paymentRouter);

// starting express server
app.listen(PORT, (err) => {
  if (err) {
    console.log(err);
    return err;
  }
  console.log("Server started on port " + PORT);
});
