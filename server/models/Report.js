const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  hash: { type: String, required: true },
  prediction: { type: String, required: true },
  confidence: { type: Number, required: true },
  details: {
    duration: { type: String, default: '0:10s' },
    resolution: { type: String, default: '224x224' },
    frames_analyzed: { type: Number, default: 120 },
    inference_speed: { type: String, default: '1.84s' }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema, 'reports');