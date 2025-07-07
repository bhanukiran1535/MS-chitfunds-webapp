
const express = require('express');
const Requestrouter = express.Router();
const Request = require('../Models/Request');
const userAuth = require('../middlewares/userAuth');
const adminAuth = require('../middlewares/adminAuth');

// 1. Send Prebook Request
Requestrouter.post('/prebook', userAuth, async (req, res) => {
  try {
    const { groupId } = req.body;
    const newRequest = new Request({
      userId: req.user._id,
      groupId,
      type: 'month_prebook'
    });
    await newRequest.save();
    res.status(200).json({ success: true, message: 'Prebook request sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 2. Send Payment Confirmation Request
Requestrouter.post('/payment', userAuth, async (req, res) => {
  try {
    const { groupId, monthKey, amount } = req.body;
    const newRequest = new Request({
      userId: req.user._id,
      groupId,
      type: 'confirm_cash_payment',
      monthKey,
      amount
    });
    await newRequest.save();
    res.status(200).json({ success: true, message: 'Payment confirmation request sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 3. Send Leave Group Request
Requestrouter.post('/leave', userAuth, async (req, res) => {
  try {
    const { groupId } = req.body;
    const newRequest = new Request({
      userId: req.user._id,
      groupId,
      type: 'leave_group'
    });
    await newRequest.save();
    res.status(200).json({ success: true, message: 'Leave group request sent' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 4. Admin - View All Pending Requests
Requestrouter.get('/admin/requests', userAuth, adminAuth, async (req, res) => {
  try {
    const requests = await Request.find({ status: 'pending' })
      .populate('userId', 'firstName email')
      .populate('groupId', 'groupNo');
    res.status(200).json({ success: true, requests });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Admin - Approve Request
Requestrouter.patch('/admin/request/:id/approve', userAuth, adminAuth, async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    // Future logic: add user to group, mark payment, etc.
    res.status(200).json({ success: true, message: 'Request approved', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 6. Admin - Reject Request
Requestrouter.patch('/admin/request/:id/reject', userAuth, adminAuth, async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
    res.status(200).json({ success: true, message: 'Request rejected', request });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = Requestrouter;