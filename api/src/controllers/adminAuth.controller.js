import { adminModel } from "../models/admin.model.js";
import {
  comparePassword,
  getHashedPassword,
} from "../utils/genHashedPassword.js";
import { generateToken } from "../utils/webToken.js";

export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      const err = new Error(`Invalid username or password`);
      throw err;
    }

    const isAdmin = await adminModel.findOne({ username });
    if (!isAdmin) {
      const err = new Error(`Invalid username`);
      throw err;
    }

    if (!comparePassword(password, isAdmin.password)) {
      const err = new Error(`Invalid password`);
      throw err;
    }

    const token = generateToken(isAdmin._id);

    res.json({ success: true, message: "Login successful", token: token });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
};

// export const adminSignup = async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     if (!username || !password) {
//       const err = new Error(`Invalid username or password`);
//       throw err;
//     }

//     const admins = await adminModel.find();
//     if (admins.length == 1) {
//       const err = new Error(`Invalid request`);
//       throw err;
//     }

//     const hashedPassword = getHashedPassword(password);

//     const addAdmin = new adminModel({
//       username,
//       password: hashedPassword,
//     });
//     await addAdmin.save();

//     res.json({ success: true, message: "Sign Up Successfull" });
//   } catch (error) {
//     res.json({ success: false, error: error.message });
//   }
// };
