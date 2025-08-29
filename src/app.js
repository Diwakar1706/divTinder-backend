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

 


connectDB().then(()=>{
    console.log("DataBAse connected Successfully");
    app.listen(8001, () => {
    console.log("✅ Server is successfully listening on port 8001");
});

})
.catch((err)=>{
    console.error("Databse cannot conncted")
})

