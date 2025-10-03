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
    // ✅ 1. Get token from cookie or Authorization header
    const token =
      req.cookies?.jwt ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No token provided");
    }

    // ✅ 2. Verify token
    const decoded = jwt.verify(token, "DEV@Tinder$790");
    const { _id } = decoded;

    // ✅ 3. Find user
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    // ✅ 4. Attach user to request
    req.user = user;
    next();

  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { userAuth };

