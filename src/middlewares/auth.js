// const jwt = require("jsonwebtoken");
// const User = require("../models/user");

// const userAuth = async (req, res, next) => {
//   try {
//     // 🔑 Get the token from the cookie named "jwt"
//     const token = req.cookies.jwt;

//     if (!token) {
//       throw new Error("No token provided");
//     }

//     // Verify token
//     const decodedObj = jwt.verify(token, "DEV@Tinder$790");
//     const { _id } = decodedObj;

//     // Find user
//     const user = await User.findById(_id);
//     if (!user) {
//       throw new Error("User not found");
//     }

//     // Attach user to request
//     req.user = user;
//     next();

//   } catch (err) {
//     res.status(401).json({ error: err.message });
//   }
// };

// module.exports = { userAuth };
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // ✅ token from cookie
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, "DEV@Tinder$790");
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: " + err.message });
  }
};

module.exports = { userAuth };
