const express = require("express");
const groupRoute = express.Router();
const userAuth = require('../middlewares/userAuth');
const adminAuth = require('../middlewares/adminAuth');
const Group = require('../Models/Group');
const GenerateMonths = require('../Utils/GenerateMonths');
const Month = require('../Models/MonthDetails');

groupRoute.post('/create',userAuth,adminAuth, async (req,res)=>{
   try{
    const info = await Group.create(req.body);
    res.status(200).json({success:true,groupDetails:info});
   }catch(err){
    res.status(400).json({success:false,message:err.message});
   }
})

groupRoute.get('/:id', async (req, res) => {
  try {
    const group = await Group.findById(req.params.id).populate('members', 'firstName email');
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }
    res.status(200).json({ success: true, group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


groupRoute.patch('/join/:groupid',userAuth, async (req,res)=>{
   try{
    const grpId = req.params.groupid;
    const grp = await Group.findById(grpId);
    if(!grp){
      return res.status(404).json({success:false,message:"Group not found"});
    }
    const Id = req.user._id;
    if(grp.members.includes(Id)){
      return res.status(404).json({success:false,message:"You already joined the Group"});
    }
    const monthsArray = GenerateMonths(grp.startMonth, grp.tenure);
    await Month.insertMany(monthsArray);
    grp.members.push(Id);
    await grp.save();
    res.status(200).json({success:true,groupDetails:grp});
   }catch(err){
    res.status(400).json({success:false,message:err.message});
   }
})

groupRoute.get('/myGroups', userAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const groups = await Group.find({ members: userId }).select('-__v -createdAt -updatedAt -members -foremanCommission -groupNo'); // exclude unwanted fields;
    res.status(200).json({ success: true, groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});


groupRoute.patch('/leave/:groupid', userAuth, async (req, res) => {
  try {
    const groupId = req.params.groupid;
    const userId = req.user._id;

    // Find the group by ID
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ success: false, message: "Group not found" });
    }

    // Check if user is a member
    const isMember = group.members.some(memberId => memberId.equals(userId));
    if (!isMember) {
      return res.status(400).json({ success: false, message: "You are not a member of this group" });
    }
    // can't leave Now
    if (Date.now() >= new Date(group.startMonth).getTime()) {
      return res.status(400).json({ success: false, message: "This group has started you can't leave now" });
    }
    // Remove the user from members
    group.members = group.members.filter(memberId => !memberId.equals(userId));
    await group.save();
    
    return res.status(200).json({ success: true, message: "You have left the group", group });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = groupRoute;

