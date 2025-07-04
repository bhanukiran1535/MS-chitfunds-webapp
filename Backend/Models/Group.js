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
  members:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User" // Must be a string 
  }],
  foremanCommission:{
    type: Number,  // % percentage
    required: true
  }
}, { timestamps: true })
const GroupModel = mongoose.model('Group',GroupSchema);
module.exports = GroupModel;

//Bid amount / Auction amount
// Foreman's commission	Fee taken by the organizer (usually 5%)