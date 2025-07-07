const express = require('express');
const monthRoute = express.Router();
const Month = require('../Models/MonthDetails');
const userAuth = require('../middlewares/userAuth');

// GET /group/:id/months → Fetch user's monthly status for a group
monthRoute.get('/:grpid/months', userAuth, async (req, res) => {
  try {
    const groupId = req.params.grpid;
    const userId = req.user._id;

    const months = await Month.find({ groupId, userId })
      .sort({ monthKey: 1 })  // Sort chronologically
      .select('-__v -groupId -userId');

    res.status(200).json({ success: true, months });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = monthRoute;
