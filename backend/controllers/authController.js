import crypto from "crypto";
import { genToken } from "../configs/token.js";
import validator from "validator";

import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

import sendMail from "../configs/Mail.js";

export const signUp = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    let existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "email already exist" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Please enter valid Email" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Please enter a Strong Password" });
    }

    let hashPassword = await bcrypt.hash(password, 10);
    let user = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    const otp = crypto.randomInt(100000, 999999).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    try {
      await sendMail(email, otp, "Verify Your Email");
    } catch (emailError) {
      await User.deleteOne({ _id: user._id });
      console.log("signUp error - email send failed:", emailError.message);
      return res.status(500).json({ message: "Failed to send verification email. Please try again." });
    }
    return res.status(201).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.log("signUp error");
    return res.status(500).json({ message: "Signup failed" });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.verificationOtp !== otp || user.verificationOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.verificationOtp = undefined;
    user.verificationOtpExpires = undefined;
    await user.save();
    await user.populate("enrolledCourses");

    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log("verifyEmail error");
    return res.status(500).json({ message: "Email verification failed" });
  }
};

export const resendVerificationOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    user.verificationOtp = otp;
    user.verificationOtpExpires = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendMail(email, otp, "Verify Your Email");
    return res.status(200).json({ message: "OTP resent to your email" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to resend OTP" });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user does not exist" });
    }
    let isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect Password" });
    }
    if (!user.isVerified) {
      if (!user.verificationOtp) {
        user.isVerified = true;
        await user.save();
      } else {
        return res.status(403).json({ message: "Please verify your email first" });
      }
    }
    await user.populate("enrolledCourses");
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log("login error");
    return res.status(500).json({ message: "Login failed" });
  }
};

export const logOut = async (req, res) => {
  try {
    await res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none"
});
    return res.status(200).json({ message: "logOut Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed" });
  }
};

export const googleSignup = async (req, res) => {
  try {
    const { name, email, role = "student" } = req.body;
    const selectedRole = role === "educator" ? "educator" : "student";
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        email,
        role: selectedRole,
        isVerified: true,
      });
    } else if (user.role !== selectedRole) {
      user.role = selectedRole;
      if (name && user.name !== name) {
        user.name = name;
      }
      await user.save();
    }
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }
    await user.populate("enrolledCourses");
    let token = await genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Google signup failed" });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "If the email exists, an OTP has been sent" });
    }
    const otp = crypto.randomInt(100000, 999999).toString();

    ((user.resetOtp = otp),
      (user.otpExpires = Date.now() + 5 * 60 * 1000),
      (user.isOtpVerifed = false));

    await user.save();
    await sendMail(email, otp, "Reset Your Password");
    return res.status(200).json({ message: "If the email exists, an OTP has been sent" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    user.isOtpVerifed = true;
    user.resetOtp = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: "OTP varified " });
  } catch (error) {
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: "Please enter a strong password (min 8 characters)" });
    }
    const user = await User.findOne({ email });
    if (!user || !user.isOtpVerifed) {
      return res.status(404).json({ message: "OTP verification required" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    user.isOtpVerifed = false;
    await user.save();
    return res.status(200).json({ message: "Password Reset Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Password reset failed" });
  }
};
