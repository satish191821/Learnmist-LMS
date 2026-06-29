import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { searchWithAi } from "../controllers/aiController.js"

let aiRouter = express.Router()

aiRouter.post("/search",isAuth,searchWithAi)

export default aiRouter