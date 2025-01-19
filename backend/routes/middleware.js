require("dotenv").config();
const jwt_secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const authMiddleware = async (req, res, next) => {
  console.log("auth Jwt secret: ", jwt_secret);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403).json({
      message: "Invallid authorization header",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwt_secret);
    req.userId = decoded.userId;
    next();
  } catch (e) {
    console.error("error details: ", e);
    return res.status(403).json({
      message: "middleware error",
    });
  }
};

module.exports = authMiddleware;
