import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
  try {
    // getting the token
    const token = req.headers.authorization.split(" ")[1];

    // decoding and verfying the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // extracting the info from the decoded token
    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
};
