const mongoose = require("mongoose");
const BookinghistorySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, "Please add booking date"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Please add a user"],
    },
    hotel: {
      type: mongoose.Schema.ObjectId,
      ref: "Hotel",

      required: [true, "Please add a hotel"],
    },
    roomType: {
      type: String,
      required: [true, "Please add a roomtype"],
    },
    contactEmail: {
      type: String,
      required: [true, "Please add a contact email"],
    },
    contactName: {
      type: String,
      required: [true, "Please add a contact name"],
    },
    contactTel: {
      type: String,
      required: [true, "Please add a contact telephone number"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      default: -1,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Bookinghistory", BookinghistorySchema);
