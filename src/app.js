const express = require("express");
const app = express();
const connectDB=require("./config/database");
const cookieParser = require("cookie-parser"); // <-- add this


const {userAuth} =require("./middlewares/auth");
const User=require("./models/user");
const validator=require("validator");
const cors=require("cors")

app.use(cors())
app.use(express.json())
app.use(cookieParser());
const authRouter=require("./routes/auth");
const profileRouter=require("./routes/profile");
const requestsRouter=require("./routes/requests");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestsRouter);
app.get("/",(req,res)=>{
    res.send("Welcome to DevTinder")
})

// app.get("/user", async (req,res)=>{
//   const userEmail=req.body.emailId;
//   try{
//     const users =await User.find({emailId:userEmail});
//     if(users.length==0){
//       res.status(400).send("someting went wrong")
//     }else{
//       res.send(users);
//     }
    
//   }catch(err){
//     res.status(400).send("somenting went wrong")
//   }
// })

// app.delete("/user",async(req,res)=>{
//   const userId=req.body.userId;
//   console.log("User is",userId);
//   try{
//     const users=await User.findByIdAndDelete(userId);
//     res.send("user deleted sussessfully")

//   }catch(err){
//     res.status(400).send("somenting went wrong")

//   }
// })

// app.patch("/user/usedId", async (req, res) => {
//   const { userId, ...data } = req.body.params?.userId;
//   const ALLOWED_UPDATES = ["photourl", "about", "gender", "age", "skills"];

//   // ✅ Step 1: Validate keys
//   const updates = Object.keys(data);
//   const isValidOperation = updates.every((key) =>
//     ALLOWED_UPDATES.includes(key)
//   );

//   if (!isValidOperation) {
//     return res.status(400).send("Invalid updates");
//   }
//   if(data?.skills.length>10){
//     throw new Error("skills size not more than 10")
//   }

//   try {
//     // ✅ Step 2: Update user
//     const user = await User.findByIdAndUpdate(userId, data, {
//       new: true,
//       runValidators: true, // ✅ ensures schema validators run
//     });

//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     res.send({ message: "User updated successfully", user });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(400).send("Something went wrong");
//   }
// });

// app.get("/feed",async (req,res)=>{
//   try{
//     const users=await User.find({})
//     res.send(users)
//   }catch(err){
//     res.status(400).send("somenting went wrong")

//   }
// })

connectDB().then(()=>{
    console.log("DataBAse connected Successfully");
    app.listen(8001, () => {
    console.log("✅ Server is successfully listening on port 8001");
});

})
.catch((err)=>{
    console.error("Databse cannot conncted")
})

