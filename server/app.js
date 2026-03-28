import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import traceRoutes from "./routes/traceRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import detectRoutes from "./routes/detect.js";
import explainRoutes from "./routes/explain.js";
import finalSummaryRoutes from "./routes/finalSummary.js";
import programRoutes from "./routes/programRoutes.js";

function buildAllowedOrigins() {
  return (process.env.FRONTEND_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin, allowedOrigins) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.length === 0) {
    return (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin.includes(".vercel.app")
    );
  }

  return allowedOrigins.includes(origin);
}

export function createApp() {
  const app = express();
  const allowedOrigins = buildAllowedOrigins();

  app.use(
    cors({
      origin(origin, callback) {
        if (isAllowedOrigin(origin, allowedOrigins)) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin ${origin} is not allowed by CORS.`));
      },
      credentials: false,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 40,
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use("/api/auth", authLimiter, authRoutes);
  app.use("/api/traces", traceRoutes);
  app.use("/api/favorites", favoriteRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/detect", detectRoutes);
  app.use("/api/explain", explainRoutes);
  app.use("/api/final-summary", finalSummaryRoutes);
  app.use("/api/programs", programRoutes);

  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "logiclens-server",
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({
      message: error.message || "Something went wrong.",
    });
  });

  return app;
}
