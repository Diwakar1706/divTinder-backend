const mongoose=require("mongoose");
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:["ignore","interested","rejected","accepted"],
        message:`{VALUE} is not supported`
    }
},
{timestamps:true},


);
connectionRequestSchema.pre("save",async function(next){
    if(this.fromUserId.toString()===this.toUserId.toString()){
        throw new Error("You cannot send a request to yourself");
    }
    next();
});


module.exports=mongoose.model("ConnectionRequest",connectionRequestSchema);
