import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

import profileRoutes from "./routes/profile.routes.js";

import resumeRoutes from "./routes/resume.routes.js";
import jobRoutes from "./routes/job.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import interviewRoutes from "./routes/interview.routes.js";

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      process.env.CLIENT_URL
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(morgan("dev"));

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/resume",
  resumeRoutes
);

app.use(
  "/api/job",
  jobRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/interview",
  interviewRoutes
);

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TalentMind API Running",
  });
});

export default app;