const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // add ref for clarity
    },
    status: {
      type: String,
      required: true,
      enum: ["ignore", "interested", "rejected", "accepted"],
      message: `{VALUE} is not supported`,
    },
  },
  { timestamps: true }
);

// ✅ Move the unique index to this schema (not userSchema)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });

// Prevent self-request
connectionRequestSchema.pre("save", async function (next) {
  if (this.fromUserId.toString() === this.toUserId.toString()) {
    throw new Error("You cannot send a request to yourself");
  }
  next();
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
