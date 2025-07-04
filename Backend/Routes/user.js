// routes/user.js
const express = require('express');
const userRoute = express.Router();
const User = require("../Models/User");
const userAuth = require('../middlewares/userAuth');

userRoute.post('/create', async (req, res) => {
  try {
    const {password} = req.body;
    const newUser = new User(req.body);
    const passwordHash = await newUser.createpasswordHash(password);
    newUser.password = passwordHash; // Assign hashed password
    await newUser.save();  // insertOne is in MongoDB native
  // const newUser = await User.create(req.body);  
    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

userRoute.post('/login',async (req,res)=>{
  try{
    const {password,email} = req.body;
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const isMatch = await user.compareHash(password);
    if(!isMatch){
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const token = await user.getJWT();
    res.cookie("token",token);
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch(err){
    res.status(400).json({ success: false, message: err.message });
   }
})

userRoute.get('/viewProfile',userAuth, async (req,res)=>{
  try{
    const ID = req.user._id;
    const info = await User.findById(ID);
    res.status(200).json({ 
      success: true, 
      message: "Account details",
      user: {
        id: info.userId,
        firstName: info.firstName,
        lastName: info.lastName,
        email: info.email,
        phoneNo: info.phoneNo,
      }});
  }catch(err){
    res.status(400).json({ success: false, message: err.message });
  }
})

userRoute.get('/logout',userAuth, async (req,res)=>{
  try{
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch(err){
    res.status(400).json({ success: false, message: err.message });
   }
})

userRoute.delete('/delete',userAuth, async (req,res)=>{
  try{
    const ID = req.user._id;
    const info = await User.findByIdAndDelete(ID);
    res.status(200).json({ 
      success: true, 
      message: "This Profile Has been Deleted Successfully",
      user: {
        id: info._id,
        firstName: info.firstName,
        email: info.email,
        isAdmin: info.isAdmin
      }});
  }catch(err){
    res.status(400).json({ success: false, message: err.message });
  }
})

module.exports = userRoute; // "wire it" to main Express app
