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
    type: String, // e.g., "June 2025"
    required: true
  },
  monthKey: {
    type: String, // e.g., "2025-06"
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'due', 'paid', 'pending'],
    default: 'upcoming'
  },
  dueAmount:{
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String
  },
  paymentDate: { 
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model('Month', MonthSchema);
