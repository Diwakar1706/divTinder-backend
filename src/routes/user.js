const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const user = require("../models/user");

const userRouter = express.Router();

// Route to get all connection requests sent to logged-in user
userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Fetch connection requests where logged-in user is the receiver
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested", // correct spelling
    }).populate("fromUserId", "firstName lastName photoUrl skills about gender");

    res.json({
      message: "Data fetched successfully",
      data: requests,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});





userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Fetch all accepted connections where the user is either sender or receiver
    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
      status: "accepted",
    }).populate("fromUserId toUserId", "firstName lastName photourl skills about gender");

    // Map to return only the other user in each connection
    const connectionUsers = connections.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.json({
      message: "Connections fetched successfully",
      data: connectionUsers,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});




userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Pagination params
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit; // max limit 50
    const skip = (page - 1) * limit;

    // Fetch all connection requests involving the logged-in user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    // Collect all users to hide from feed
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((request) => {
      hideUsersFromFeed.add(request.fromUserId.toString());
      hideUsersFromFeed.add(request.toUserId.toString());
    });
    hideUsersFromFeed.add(loggedInUser._id.toString()); // hide self

    // Fetch feed users
    const users = await user.find({
      _id: { $nin: Array.from(hideUsersFromFeed) },
    })
      .select("firstName lastName photourl skills about gender")
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = userRouter;


// http://localhost:8001/feed?page=1&limit=10
