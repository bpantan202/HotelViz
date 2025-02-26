const Booking = require("../models/Booking");
const Bookinghistory = require("../models/Bookinghistory");
const Hotel = require("../models/Hotel");
const User = require("../models/User");

//@desc Get all bookings
//@route GET /api/v1/bookings
//@access Public
exports.getBookings = async (req, res, next) => {
  let query;
  //General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name address district province postalcode tel region image",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.hotelId) {
      query = Booking.find({ hotel: req.params.hotelId }).populate({
        path: "hotel",
        select: "name address district province postalcode tel region image",
      });
    } else
      query = Booking.find().populate({
        path: "hotel",
        select: "name address district province postalcode tel region image",
      });
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Get single booking
//@route GET /api/v1/bookings/:id
//@access Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "hotel",
      select: "name description tel",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking" });
  }
};

//@desc Add booking
//@route POST /api/v1/hotels/: hotelId/booking
//@access Private
exports.addBooking = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;

    //Check for existed booking
    const existedBookings = await Booking.find({ user: req.user.id });

    //If the user is not an admin, they can only create 3 booking.
    if (existedBookings.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking" });
  }

  try {
    const booking = await Booking.create(req.body);

    // Add points to the user after successful booking creation if role is "user"
    if (req.user.role === "user") {
      // Add the price of the room type to the user's points
      const pointsToAdd = parseInt(booking.price / 10);
      const exptoAdd = parseInt(booking.price / 100);

      // Find the user and update their points
      const user = await User.findById(req.user.id);
      user.point += pointsToAdd;
      user.experience += exptoAdd;
      await user.save();
    }

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    //console.log(error.stack);
    return res.status(400).json({
      success: false,
      message: "The requested body does not match the Booking model",
    });
  }
};

//@desc Update booking
//@route PUT/api/v1/bookings/:id
//@access Private
exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking" });
  }
};

//@desc Delete booking
//@route DELETE /api/v1/bookings/:id
//@access Private
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this booking`,
      });
    }

    await booking.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Booking" });
  }
};

//-------------------------------------------------------------------------------------
// Booking Histories

//@desc Get booking history
//@route GET /api/v1/bookings/history
//@access Public
exports.getBookingHistory = async (req, res, next) => {
  let query;
  //General users can see only their bookings!
  if (req.user.role !== "admin") {
    query = Bookinghistory.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name address district province postalcode tel region image",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.hotelId) {
      query = Bookinghistory.find({ hotel: req.params.hotelId }).populate({
        path: "hotel",
        select: "name address district province postalcode tel region image",
      });
    } else
      query = Bookinghistory.find().populate({
        path: "hotel",
        select: "name address district province postalcode tel region image",
      });
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Booking history" });
  }
};

//@desc Add booking history
//@route POST /api/v1/hotels/:hotelId/booking/history
//@access Private
exports.addBookingHistory = async (req, res, next) => {
  try {
    req.body.hotel = req.params.hotelId;
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel with the id of ${req.params.hotelId}`,
      });
    }
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Booking history" });
  }

  try {
    const booking = await Bookinghistory.create(req.body);
    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    //console.log(error.stack);
    return res.status(400).json({
      success: false,
      message: "The requested body not match the Booking history model",
    });
  }
};

//@desc Update booking
//@route PUT/api/v1/bookings/history/:id
//@access Private
exports.updateBookingHistory = async (req, res, next) => {
  try {
    let booking = await Bookinghistory.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking history with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the booking owner
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this booking history`,
      });
    }

    booking = await Bookinghistory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    //console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Booking history" });
  }
};
