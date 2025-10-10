const {validateSignUpData}=require("../utils/validation");
const bcrypt=require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const User=require("../models/user");
const {userAuth} =require("../middlewares/auth");
const validator = require("validator");


const express=require ("express");
const authRouter=express.Router();


authRouter.post("/signup", async (req, res) => {
 try {
  //validate
    validateSignUpData(req);
    
    //encrypt
    const{firstName,lastName,emailId,password}=req.body;
    const passwordHash=await bcrypt.hash(password,10)
    // console.log(passwordHash)


    const user = new User({
      firstName,
      lastName,
      emailId,
      password:passwordHash
    });
    await user.save();
    res.status(201).send({ message: "User created successfully", user });
 } catch (error) {
    console.error("Signup error:", error.message);
    res.status(400).send({ error: error.message });
 }
});


authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Validate email
    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid email");
    }

    // Find user
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Email not found in DB");
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    // Generate JWT
    const token = jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
      expiresIn: "7d",
    });

    // Send cookie + response
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ✅ fixed
      httpOnly: true,
      secure: false // set true only in HTTPS
    });

    res.status(200).send(user);

  } catch (err) {
    console.error("Login error:", err.message);
    res.status(400).send({ error: err.message });
  }
});

authRouter.post("/logout",userAuth, (req, res) => {
  try {
    res.cookie("jwt", null, {   //token nulll kar diya
        expires: new Date(Date.now()),

        httpOnly: true,
        secure: false // set true only in HTTPS
    });
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
module.exports=authRouter;
