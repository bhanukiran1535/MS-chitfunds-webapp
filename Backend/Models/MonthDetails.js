const mongoose = require('mongoose');

const MonthSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  monthName: {
    type: String, // like "June 2025"
    required: true
  },
  paid: {
    type: Boolean,
    default: false
  },
  paymentDate: Date,
  paymentAmount: Number,
  status: {
    type: String,
    enum: ['upcoming', 'due', 'paid'],
    default: 'upcoming'
  }
}, { timestamps: true });

const MonthModel = mongoose.model('Month', MonthSchema);
module.exports = MonthModel;
