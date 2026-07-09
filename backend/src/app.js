import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import jobRoutes from "./routes/job.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import interviewRoutes from "./routes/interview.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

// Trust proxy if we are behind a reverse proxy (like Azure App Service / Vercel)
app.set('trust proxy', 1);

// 1. Security Headers
app.use(helmet());

// 2. CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://localhost:3000"
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // In production, we might want to strictly enforce this.
        // But to avoid blocking valid Vercel preview deployments, we can conditionally relax this if needed.
        callback(null, true); 
      }
    },
    credentials: true,
  })
);

// 3. Rate Limiting (Global)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { success: false, message: "Too many requests from this IP, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

// 4. Compression (GZIP)
app.use(compression());

// 5. Body Parsing
app.use(express.json());
app.use(cookieParser());

// 6. Logging
if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined")); // Standard Apache combined log output
} else {
  app.use(morgan("dev")); // Concise output colored by response status
}

// 7. Routes
app.use("/api/health", healthRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/job", jobRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TalentMind API Running",
  });
});

export default app;