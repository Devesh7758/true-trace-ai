const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware (JWT is sent in the Authorization header, so open CORS is safe here)
app.use(cors());
app.use(express.json());

// Don't queue queries for 10s when the DB is down — fail immediately with a clear error
mongoose.set("bufferCommands", false);

// Root + health routes (health is also handy for Render's health check / waking the service)
app.get("/", (req, res) => {
  res.send("TrueTrace Backend API Running Successfully 🚀");
});

app.get("/api/health", (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const db = states[mongoose.connection.readyState] || "unknown";
  res.status(db === "connected" ? 200 : 503).json({ status: "ok", db });
});

// Return 503 instead of a confusing timeout when MongoDB isn't connected
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ message: "Database unavailable. Please try again shortly." });
  }
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Database Connection
if (!process.env.MONGO_URI) console.error("❌ MONGO_URI is not set");
if (!process.env.JWT_SECRET) console.error("❌ JWT_SECRET is not set");

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => console.log("📁 Connected to Cloud MongoDB Atlas Engine"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("   Check MONGO_URI on Render and Atlas → Network Access (allow 0.0.0.0/0).");
  });

// Server Listener
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Node Engine active on port ${PORT}`);
});
