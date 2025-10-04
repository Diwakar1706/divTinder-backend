const {userAuth} =require("../middlewares/auth");

const express = require('express'); 
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // Send profile data as JSON
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = profileRouter;
