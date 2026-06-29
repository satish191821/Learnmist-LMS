import jwt from "jsonwebtoken"
export const genToken = async(userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured")
  }
  try {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "7d"})
    return token
  } catch (error) {
    console.log("token error", error.message)
    throw error
  }
}