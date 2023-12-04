import jwt from "jsonwebtoken";

export const generateToken = (key) => {
  const token = jwt.sign({ userId: key }, process.env.JWT_SECRET_KEY);
  return token;
};
