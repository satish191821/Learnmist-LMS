import express from "express"
import isAuth from "../middlewares/isAuth.js"
import isEducator from "../middlewares/isEducator.js"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from "../controllers/courseController.js"
import upload from "../middlewares/multer.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,isEducator,createCourse)
courseRouter.get("/getpublishedcoures",getPublishedCourses)
courseRouter.get("/getcreatorcourses",isAuth,isEducator,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,isEducator,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,isEducator,removeCourse)
courseRouter.post("/createlecture/:courseId",isAuth,isEducator,createLecture)
courseRouter.get("/getcourselecture/:courseId",isAuth,getCourseLecture)
courseRouter.post("/editlecture/:lectureId",isAuth,isEducator,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,isEducator,removeLecture)
courseRouter.post("/getcreator",isAuth,getCreatorById)







export default courseRouter