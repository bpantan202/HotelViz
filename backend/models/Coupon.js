const mongoose = require("mongoose");
const CouponSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, "Please add coupon type"],
    },
    discount: {
      type: Number,
      required: [true, "Please add discount amount"],
    },
    tiers: [{ type: String }],
    point: {
      type: Number,
      required: [true, "Please add required point"],
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      default: null,
    },
    used: {
      type: Boolean,
      default: false,
    },
    expiredDate: {
      type: Date,
      required: [true, "Please add expired date"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Coupon", CouponSchema);
