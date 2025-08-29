const mongoose=require("mongoose");

const connectDB=async()=>{
    await mongoose.connect(
        "mongodb+srv://diwakarshaw288:i3qN182uzxjIg822@cluster0.wuyu24g.mongodb.net/"
  );
};
module.exports=connectDB;

