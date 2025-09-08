const express = require("express");
const app = express();
const connectDB=require("./config/database")
const {adminAuth} =require("./middlewares/auth")
const User=require("./models/user")

////midleware for auth admin
// app.use("/admin", adminAuth);
// app.get("/admin/getAllData",(req,res)=>{
//     res.send("user data send")
// })


app.use(express.json())
app.post("/signup", async (req, res) => {
  const user = new User(req.body)

 try{
    await user.save();
    res.status(201).send({ message: "User created successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Error creating user" });
  }
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

