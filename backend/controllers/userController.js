import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";
import Review from "../models/reviewModel.js";
import Order from "../models/orderModel.js";
import Lecture from "../models/lectureModel.js";

export const getCurrentUser = async (req,res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
         if(!user){
            return res.status(400).json({message:"user does not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({message:"get current user error"})
    }
}

export const UpdateProfile = async (req,res) => {
    try {
        const userId = req.userId
        const {name , description} = req.body
        let photoUrl
        if(req.file){
           photoUrl =await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId,{name,description,photoUrl}, {new:true}).select("-password")


        if(!user){
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
         console.log(error);
       return res.status(500).json({message:"Profile update failed"})
    }
}

export const deleteAccount = async (req, res) => {
    try {
        const userId = req.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        await Course.updateMany(
            { enrolledStudents: userId },
            { $pull: { enrolledStudents: userId } }
        )

        await Review.deleteMany({ user: userId })
        await Order.deleteMany({ student: userId })

        if (user.role === "educator") {
            const educatorCourses = await Course.find({ creator: userId })
            for (const course of educatorCourses) {
                await Lecture.deleteMany({ _id: { $in: course.lectures } })
            }
            await Course.deleteMany({ creator: userId })
        }

        await User.findByIdAndDelete(userId)

        res.clearCookie("token", {
            httpOnly: true,
            secure: req.secure,
            sameSite: req.secure ? "none" : "lax"
        })

        return res.status(200).json({ message: "Account deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Account deletion failed" })
    }
}
