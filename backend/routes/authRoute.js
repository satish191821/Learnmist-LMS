import express from "express"
import rateLimit from "express-rate-limit"
import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyEmail, resendVerificationOtp, verifyOtp } from "../controllers/authController.js"

const authRouter = express.Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts. Try again later." },
})

authRouter.post("/signup", authLimiter, signUp)
authRouter.post("/verifyemail", authLimiter, verifyEmail)
authRouter.post("/resendverificationotp", authLimiter, resendVerificationOtp)

authRouter.post("/login", authLimiter, login)
authRouter.get("/logout", logOut)
authRouter.post("/googlesignup", googleSignup)
authRouter.post("/sendotp", authLimiter, sendOtp)
authRouter.post("/verifyotp", authLimiter, verifyOtp)
authRouter.post("/resetpassword", authLimiter, resetPassword)


export default authRouter