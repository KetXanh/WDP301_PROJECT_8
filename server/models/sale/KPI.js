const mongoose = require('mongoose');

const kpiSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  month: { type: String, required: true }, 
  targetSales: { type: Number, required: true },
  achievedSales: { type: Number, default: 0 },
  evaluation: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('KPI', kpiSchema);
