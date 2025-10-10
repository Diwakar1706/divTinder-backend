const {userAuth} =require("../middlewares/auth");
const {validateEditProfileData}=require("../utils/validation");

const express = require('express'); 
const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // Send profile data as JSON
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try{
      if( !validateEditProfileData(req)){
         throw new Error("Invalid edit request"); 

      }
      const loggedInUser=req.user;
      Object.keys(req.body).forEach((key)=>{loggedInUser[key]=req.body[key]})
      
      
      await loggedInUser.save();
      res.json({message:`${loggedInUser.firstName},Profile updated successfully`,user:loggedInUser})


    }catch(err){
        res.status(400).send( "Error"+ err.message );
    }

});


module.exports = profileRouter;
