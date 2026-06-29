import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, UpdateProfile, deleteAccount } from "../controllers/userController.js"
import upload from "../middlewares/multer.js"



let userRouter = express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.post("/updateprofile",isAuth,upload.single("photoUrl"),UpdateProfile)
userRouter.delete("/deleteaccount",isAuth,deleteAccount)


export default userRouter