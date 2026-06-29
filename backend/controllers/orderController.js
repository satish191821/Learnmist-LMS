import crypto from "crypto";
import Course from "../models/courseModel.js";
import razorpay from 'razorpay'
import User from "../models/userModel.js";
import dotenv from "dotenv"
dotenv.config()

export const enrollFreeCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.price && course.price > 0) {
      return res.status(400).json({ message: "This course is not free" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    if (!course.enrolledStudents.includes(req.userId)) {
      course.enrolledStudents.push(req.userId);
      await course.save();
    }

    await user.populate("enrolledCourses");
    return res.status(200).json({ message: "Enrolled successfully", user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Free enrollment failed" });
  }
};
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
})

export const createOrder = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ message: "Course price is invalid" });
    }

    const options = {
      amount: course.price * 100, // in paisa
      currency: 'INR',
      receipt: courseId.toString(),
    };

    const order = await razorpayInstance.orders.create(options);
    return res.status(200).json(order);
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: "Order creation failed" });

  }
};



export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;

    if (!razorpay_payment_id || !razorpay_signature || !courseId) {
      return res.status(400).json({ message: "Missing payment verification fields" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!course.price || course.price <= 0) {
      return res.status(400).json({ message: "Cannot pay for free course" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.receipt !== courseId) {
      return res.status(400).json({ message: "Course mismatch in payment order" });
    }
    if (orderInfo.amount !== course.price * 100) {
      return res.status(400).json({ message: "Payment amount mismatch" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed (invalid signature)" });
    }

    if (orderInfo.status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.enrolledCourses.includes(courseId)) {
      user.enrolledCourses.push(courseId);
      await user.save();
    }

    if (!course.enrolledStudents.includes(req.userId)) {
      course.enrolledStudents.push(req.userId);
      await course.save();
    }

    return res.status(200).json({ message: "Payment verified and enrollment successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error during payment verification" });
  }
};
