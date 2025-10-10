const {userAuth} =require("../middlewares/auth");
const express = require('express'); 
const requestsRouter = express.Router();
const ConnectionRequest=require("../models/connectionRequest");
const User=require("../models/user");


requestsRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
  try{
    const {status,toUserId}=req.params;
    const fromUserId=req.user._id;
    const allowedStatuses=["ignore","interested","rejected","accepted"];
    if(!allowedStatuses.includes(status)){
        throw new Error("Invalid status");
    }


    // // ✅ Prevent user from sending request to self
    // if (fromUserId.toString() === toUserId) {
    //   throw new Error("You cannot send a request to yourself");
    // }


    // ✅ Check if toUserId exists
    const toUser = await User.findById(toUserId); 
    if (!toUser) {
      throw new Error("The user you are trying to connect with does not exist");
    }

    
    const existingRequest=await ConnectionRequest.findOne({
      $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
    });
    if(existingRequest){
      return res.status(400).json({error:"Connection request already exists"});
    }

    const connectionRequest=new ConnectionRequest({fromUserId,toUserId,status});
     const data=await connectionRequest.save();
    res.status(200).json({message:"Connection request sent successfully",data});
  }catch(err){
    res.status(400).json({error:err.message});
  }
});

// requestsRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
//   console.log("sending a connection request");
//   const user=req.user;
//   res.send(user.firstName+" sent connection req!");

// });


module.exports = requestsRouter;