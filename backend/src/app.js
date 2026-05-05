const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const templateRoutes = require("./routes/template.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const favouriteRoutes = require("./routes/favourite.routes");
const { errorHandler } = require("./middlewares/error.middleware");
const { notFound } = require("./middlewares/notFound.middleware");

const app = express();

// ─── Security Middlewares ────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// ─── Rate Limiting ───────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: "Too many requests, please try again later." },
});
app.use("/api", limiter);

// ─── Body Parsing ────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ────────────────────────────────────────────────────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ─── Health Check ────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "SaaS Template Store API is running 🚀", timestamp: new Date().toISOString() });
});

// ─── Routes ─────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/favourites", favouriteRoutes);

// ─── Error Handlers ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
