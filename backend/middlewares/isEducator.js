import User from "../models/userModel.js";

const isEducator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || user.role !== "educator") {
      return res.status(403).json({ message: "Access denied. Educator role required." });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Authorization check failed" });
  }
};

export default isEducator;
