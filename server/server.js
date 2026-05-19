const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log(
      "📁 Connected to Cloud MongoDB Atlas Engine"
    )
  )
  .catch((err) =>
    console.error(
      "Database connection exception:",
      err
    )
  );

// Routes
app.use("/api/auth", authRoutes);

app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(
    `🚀 Node Engine active on port ${PORT}`
  )
);