const mongoose=require("mongoose");
const userSchema=mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        minLength:4,
        maxlength:30
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        require:true,
        unique:true,lowercase:true
    },
    password:{
        type:String
    },
    age:{
        type:Number,
    },
    gender:{
        type:String
    },
    photourl:{
        type:String,
        default:"https://tse2.mm.bing.net/th/id/OIP.b-VXMyLRKFeTc9B0RNFAXwHaHa?pid=Api&P=0&h=180"

    },
    about:{
        type:String,

    },
    skills:{
        type:[String]
    },
    
  },
    {
        timetamps:true,
    }
    

)

module.exports=mongoose.model("User",userSchema);