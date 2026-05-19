const Report = require('../models/Report');

exports.saveReport = async (req, res) => {
  try {
    const { filename, hash, prediction, confidence, details } = req.body;
    const newReport = new Report({
      userId: req.user.id,
      filename,
      hash,
      prediction,
      confidence,
      details
    });
    await newReport.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const history = await Report.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};