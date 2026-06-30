import jwt from "jsonwebtoken";
const isAuth = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);

    if (!verifyToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
export default isAuth;
