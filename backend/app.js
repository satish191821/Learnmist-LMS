import dotenv from "dotenv"
dotenv.config()

import helmet from "helmet"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import authRouter from "./routes/authRoute.js"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(helmet())
app.use(express.json({ limit: "1mb" }))
app.use(cookieParser())

const allowedOrigins = [
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
].filter(Boolean)

app.use(cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/review", reviewRouter)

const frontendDist = path.join(__dirname, "../frontend/dist")
app.use(express.static(frontendDist))
app.get("/{*path}", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDist, "index.html"))
  }
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: "Internal server error" })
})

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err)
})

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err)
  process.exit(1)
})

export default app
