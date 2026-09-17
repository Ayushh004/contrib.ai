import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./MongoDB/db.js";
import cookieParser from "cookie-parser";
import urlProcessingRouter from "./routes/urlProcessingRouter.js";
import messagesRouter from "./routes/messagesRouter.js";
import createConversationRouter from "./routes/createConversationRouter.js";
import { initSocket } from "./socket.js";
import repoIssuesRouter from "./routes/repoIssuesRouter.js"
import authRouter from "./routes/authRouter.js";
import googleAutherizationRouter from "./routes/googleAutherizationRouter.js"
import { initRedis, closeRedis } from "./utils/redisClient.js";
dotenv.config();

const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json());

// CORS configuration for multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://contrib-ai-1.onrender.com', // Your production frontend
  'https://contrib-ai.onrender.com'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use("/api", urlProcessingRouter);
app.use("/api", messagesRouter);
app.use("/api", createConversationRouter);
app.use("/api", repoIssuesRouter);
app.use("/api", authRouter);
app.use("/api",googleAutherizationRouter);

// Health check endpoint for keep-alive services
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

initSocket(server);

const startServer = async () => {
  await connectDB();

  // Initialize Redis (optional - app will work without Redis)
  await initRedis();

  const port = 8080;

  server.listen(port, () => {
    console.log(
      `Server running on port ${port}`
    );
  });
};

// Graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  try {
    // Close Redis connection
    await closeRedis();
    
    // Close MongoDB connection
    const mongoose = await import('mongoose');
    await mongoose.default.connection.close();
    
    // Close server
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();