const mongoose = require("mongoose");
const validators=require("validator")

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

module.exports = mongoose.model("User", userSchema);
