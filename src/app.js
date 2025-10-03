const express = require("express");
const app = express();
const connectDB=require("./config/database");
const {userAuth} =require("./middlewares/auth");
const User=require("./models/user");
const {validateSignUpData}=require("./utils/validation");
const bcrypt=require("bcrypt");
const validator=require("validator");
const cookieParser = require("cookie-parser");
const jwt=require("jsonwebtoken");
const cors=require("cors")
////midleware for auth admin
// app.use("/admin", adminAuth);
// app.get("/admin/getAllData",(req,res)=>{
//     res.send("user data send")
// })

app.use(cors())
app.use(express.json())
app.use(cookieParser());


app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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


app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    // Send profile data as JSON
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/sendConnectionRequest",userAuth, async (req, res) => {
  console.log("sending a connection request");
  const user=req.user;
  res.send(user.firstName+" sent connection req!");

});

app.get("/user", async (req,res)=>{
  const userEmail=req.body.emailId;
  try{
    const users =await User.find({emailId:userEmail});
    if(users.length==0){
      res.status(400).send("someting went wrong")
    }else{
      res.send(users);
    }
    
  }catch(err){
    res.status(400).send("somenting went wrong")
  }
})

app.delete("/user",async(req,res)=>{
  const userId=req.body.userId;
  console.log("User is",userId);
  try{
    const users=await User.findByIdAndDelete(userId);
    res.send("user deleted sussessfully")

  }catch(err){
    res.status(400).send("somenting went wrong")

  }
})

app.patch("/user/usedId", async (req, res) => {
  const { userId, ...data } = req.body.params?.userId;
  const ALLOWED_UPDATES = ["photourl", "about", "gender", "age", "skills"];

  // ✅ Step 1: Validate keys
  const updates = Object.keys(data);
  const isValidOperation = updates.every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  if (!isValidOperation) {
    return res.status(400).send("Invalid updates");
  }
  if(data?.skills.length>10){
    throw new Error("skills size not more than 10")
  }

  try {
    // ✅ Step 2: Update user
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true, // ✅ ensures schema validators run
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error:", err);
    res.status(400).send("Something went wrong");
  }
});

app.get("/feed",async (req,res)=>{
  try{
    const users=await User.find({})
    res.send(users)
  }catch(err){
    res.status(400).send("somenting went wrong")

  }
})

 


connectDB().then(()=>{
    console.log("DataBAse connected Successfully");
    app.listen(8001, () => {
    console.log("✅ Server is successfully listening on port 8001");
});

})
.catch((err)=>{
    console.error("Databse cannot conncted")
})

