import app from "../app.js"
import connectDb from "../configs/db.js"
import mongoose from "mongoose"

export default async function handler(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URL)
    }
    return app(req, res)
  } catch (error) {
    console.error("Vercel handler error:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}
