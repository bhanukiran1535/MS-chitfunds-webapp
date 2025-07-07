const mongoose = require('mongoose');
const UserModel = require('./User');

const GroupSchema = new mongoose.Schema({
  // status - active,completed,upcoming
  groupNo:{
    type: Number,
    unique:true,
    required: true
  },
  chitValue: {  // Total amount pooled monthly
    type: Number,
    required: true
  }, 
  startMonth:{
    type: Date,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  members: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shareAmount: { type: Number, required: true }, // 1L, 2L etc.
    status: { type: String, enum: ['active', 'left'], default: 'active' },
    hasPrebooked: { type: Boolean, default: false },
    preBookedMonth: { type: String }, // e.g., "July 2025"
    extraMonthlyPayment: { type: Number, default: 0 } // calculated from auction logic (e.g., 1000 extra/month)
  }
],
foremanCommission:{
    type: Number,  // % percentage
    required: true
},
status: {
  type: String,
  enum: ['upcoming', 'active', 'completed'],
  default: 'upcoming'
},
}, { timestamps: true })
const GroupModel = mongoose.model('Group',GroupSchema);
module.exports = GroupModel;

//Bid amount / Auction amount
// Foreman's commission	Fee taken by the organizer (usually 5%)