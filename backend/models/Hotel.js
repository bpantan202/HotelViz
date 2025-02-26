const mongoose = require("mongoose");

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal Code can not be more than5 digits"],
    },
    tel: {
      type: String,
      required: [true, "Please add a telephone number"],
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
    image: {
      type: String,
      required: [true, "Please add an image"],
    },
    rating: {
      type: Number,
      default: 0.0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    amenities: [{ type: String }],
    roomType: [
      {
        key: String,
        price: Number,
      },
    ],
    minPrice: {
      type: Number,
      default: 0.0,
    },
    maxPrice: {
      type: Number,
      default: 0.0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Reverse populate with virtuals
HotelSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "hotel",
  justone: false,
});

//Cascade delete bookings when a hotel is deleted
HotelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    // console.log(`Bookings being removed from hotel ${this._id}`);
    await this.model("Booking").deleteMany({ hotel: this._id });
    next();
  }
);

module.exports = mongoose.model("Hotel", HotelSchema);
