const mongoose = require("mongoose");
const validators=require("validator");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value){
        if(!validators.isEmail(value)){
          throw new Error("invalid email "+ value );
          
        }
      }
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value.toLowerCase())) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photourl: {
      type: String,
      default:
        "https://tse2.mm.bing.net/th/id/OIP.b-VXMyLRKFeTc9B0RNFAXwHaHa?pid=Api&P=0&h=180",
    },
    about: {
      type: String,
      default: "Hey! I am using this app.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);



// userSchema.methods.getJWT= async function(){
//   const user=this;
//   const token=await jwt.sign({_id:user._id},"DEV@Tinder$790",{expiresIn:"7d"});
//   return token;
// }
// userSchema.methods.validatePassword=async function(passwordInputBy){
//   const user=this;
//   const passwordHash=user.password;
//   const isPasswordValid=await bcrypt.compare(passwordInputBy,passwordHash);
//   return isPasswordValid;

// }

module.exports = mongoose.model("User", userSchema);
