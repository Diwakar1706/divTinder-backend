// const {userAuth} =require("../middlewares/auth");
// const express = require('express'); 
// const requestsRouter = express.Router();
// const ConnectionRequest=require("../models/connectionRequest");
// const User=require("../models/user");
// const connectionRequest = require("../models/connectionRequest");


// requestsRouter.post("/request/send/:status/:toUserId",userAuth, async (req, res) => {
//   try{
//     const {status,toUserId}=req.params;
//     const fromUserId=req.user._id;
//     const allowedStatuses=["ignore","interested","rejected","accepted"];
//     if(!allowedStatuses.includes(status)){
//         throw new Error("Invalid status");
//     }


//     // // ✅ Prevent user from sending request to self
//     // if (fromUserId.toString() === toUserId) {
//     //   throw new Error("You cannot send a request to yourself");
//     // }


//     // ✅ Check if toUserId exists
//     const toUser = await User.findById(toUserId); 
//     if (!toUser) {
//       throw new Error("The user you are trying to connect with does not exist");
//     }

    
//     const existingRequest=await ConnectionRequest.findOne({
//       $or:[{fromUserId,toUserId},{fromUserId:toUserId,toUserId:fromUserId}]
//     });
//     if(existingRequest){
//       return res.status(400).json({error:"Connection request already exists"});
//     }

//     const connectionRequest=new ConnectionRequest({fromUserId,toUserId,status});
//      const data=await connectionRequest.save();
//     res.status(200).json({message:"Connection request sent successfully",data});
//   }catch(err){
//     res.status(400).json({error:err.message});
//   }
// });

// requestsRouter.post("/request/review/:status/requestId",userAuth,async(req,res)=>{
//   try {
//     const loggedInUser=req.user;
//     const{status,requestId}=req.params;

//     const allowedStatus=["accepted","rejected"];
//     if(!allowedStatus.includes(status)){
//       return res.status(400).json({message:"Status not allowed"});

//     }
//     const connectionRequest=await ConnectionRequest.findOne({
//       _id:requestId,
//       toUserId:loggedInUser._id,
//       status:"intrested",
//     });
//     if(!connectionRequest){
//       return res.status(404).json({message:"Connection  request not found"});
//     }

//     connectionRequest.status=status;
//     const data=await ConnectionRequest.save();
//     res.json({message:"Connection Request"+status,data});


    
//   } catch (error) {
//         res.status(400).json({error:err.message}); 
//   }
// })

// // requestsRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
// //   console.log("sending a connection request");
// //   const user=req.user;
// //   res.send(user.firstName+" sent connection req!");

// // });


// module.exports = requestsRouter;





const { userAuth } = require("../middlewares/auth");
const express = require("express");
const requestsRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

// ✅ Send Request Route
requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  try {
    const { status, toUserId } = req.params;
    const fromUserId = req.user._id;

    const allowedStatuses = ["ignore", "interested", "rejected", "accepted"];
    if (!allowedStatuses.includes(status)) {
      throw new Error("Invalid status");
    }

    const toUser = await User.findById(toUserId);
    if (!toUser) {
      throw new Error("The user you are trying to connect with does not exist");
    }

    const existingRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ error: "Connection request already exists" });
    }

    const connectionRequest = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });

    const data = await connectionRequest.save();
    res.status(200).json({ message: "Connection request sent successfully", data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Review Connection Request Route
requestsRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;

    const allowedStatuses = ["accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Status not allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: "interested", // ✅ correct spelling
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    connectionRequest.status = status;
    const data = await connectionRequest.save();

    res.status(200).json({ message: `Connection Request ${status}`, data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = requestsRouter;
