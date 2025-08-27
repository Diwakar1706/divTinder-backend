const express = require("express");
const app = express();
const {adminAuth} =require("./middlewares/auth")


app.use("/admin", adminAuth);
app.get("/admin/getAllData",(req,res)=>{
    res.send("user data send")
})



app.listen(8001, () => {
    console.log("✅ Server is successfully listening on port 8001");
});