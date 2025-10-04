const {userAuth} =require("../middlewares/auth");
const express = require('express'); 
const requestsRouter = express.Router();
requestsRouter.post("/sendConnectionRequest",userAuth, async (req, res) => {
  console.log("sending a connection request");
  const user=req.user;
  res.send(user.firstName+" sent connection req!");

});


module.exports = requestsRouter;