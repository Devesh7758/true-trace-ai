const express = require("express");

const router = express.Router();

const {
  saveReport,
  getHistory,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, saveReport);

router.get("/history", authMiddleware, getHistory);

module.exports = router;