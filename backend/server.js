import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import connectDB from "./config/database.js"
import jobRoutes from "./routes/jobRoutes.js"
import { errorHandler } from "./middleware/errorHandler.js"
import { notFound } from "./middleware/notFound.js"


dotenv.config()


connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)


app.use(
  cors({
    origin: "http://localhost:5173",
 optionsSuccessStatus: 200,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)


app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))


app.use("/api/jobs", jobRoutes)


// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Job Board API is running",
    timestamp: new Date().toISOString(),
    database: "Connected",
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`)
  console.log(`🌐 API URL: http://localhost:${PORT}/api`)
})

export default app
