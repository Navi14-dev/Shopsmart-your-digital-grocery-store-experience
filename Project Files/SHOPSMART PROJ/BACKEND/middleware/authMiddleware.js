
const jwt = require("jsonwebtoken")
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, "SECRET_KEY");
    console.log(decoded);
    // req.user = decoded;
    req.user = {
  id: decoded.id,
  role: decoded.role,
};

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized, token failed",
      err: error.message,
    });
  }
};

module.exports = authMiddleware;



