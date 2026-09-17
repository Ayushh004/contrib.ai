import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies ? req.cookies.token : null;
    
    if (!token) {
      return res.status(401).json({
        message: "Access Denied. No token provided."
      });
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = decoded;
    next();
  }
  catch (e) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }
}