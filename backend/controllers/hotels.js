const Hotel = require("../models/Hotel.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

//@desc     Get all hotels
//@route    Get /api/v1/hotels
//@access   Public
exports.getHotels = async (req, res, next) => {
  let query;
  //Copy req.query
  const reqQuery = { ...req.query };
  const toStringifyReq = { ...reqQuery };
  // console.log(req.queryPolluted.amenities);
  //Fields to exclude
  const removeFields = [
    "select",
    "sort",
    "page",
    "limit",
    "minPrice",
    "maxPrice",
  ];
  if (req.queryPolluted.amenities) removeFields.push("amenities");
  //Loop over remove fields and delete them from reqQuery
  removeFields.forEach((param) => delete toStringifyReq[param]);

  //Create query string
  let queryStr = JSON.stringify(toStringifyReq);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  queryObj = [JSON.parse(queryStr)];
  if (reqQuery["minPrice"] && reqQuery["maxPrice"]) {
    const maxPrice = reqQuery["maxPrice"];
    const minPrice = reqQuery["minPrice"];
    price_range_filter = {
      $or: [
        { minPrice: { $lte: maxPrice, $gte: minPrice } },
        { maxPrice: { $lte: maxPrice, $gte: minPrice } },
      ],
    };
    queryObj.push(price_range_filter);
  }
  if (req.queryPolluted.amenities) {
    const amenities = req.queryPolluted.amenities;
    amenities.forEach((amenity) => {
      queryObj.push({ amenities: amenity });
    });
  }
  combined_query = {
    $and: queryObj,
  };
  //console.log(combined_query);

  //finding resource
  query = Hotel.find(combined_query);
  if (req.user !== undefined)
    if (req.user.role === "admin") query = query.populate("bookings");

  //Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  //Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  //Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const total = await Hotel.countDocuments();
  query = query.skip(startIndex).limit(limit);
  //Execute query
  const hotels = await query;

  //Pagination result
  const pagination = {};
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  return res.status(200).json({
    success: true,
    count: hotels.length,
    pagination,
    data: hotels,
    total: total,
  });
};

//@desc     Get single hotels
//@route    Get /api/v1/hotels/:id
//@access   Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Post a hotels
//@route    Post /api/v1/hotels
//@access   Private
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    //console.log(error.stack);
    return res.status(400).json({
      success: false,
      message: "The requested body not match the Hotel model",
    });
  }
};

//@desc     Update single hotels
//@route    Put /api/v1/hotels/:id
//@access   Private
exports.updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Delete single hotels
//@route    Delet /api/v1/hotels/:id
//@access   Private
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(400).json({ success: false });
    }

    await hotel.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Add Rating
//@route    Put /api/v1/hotels/rating/:id
//@access   Private
exports.addRating = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    let ratingCount = hotel.ratingCount;
    let rating =
      (1.0 * (hotel.rating * ratingCount + req.body.rating)) / ++ratingCount;
    let body = {
      rating: rating,
      ratingCount: ratingCount,
    };
    hotel2 = await Hotel.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!hotel2) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

//@desc     Get hotels by price range
//@route    Get /api/v1/hotels/price
//@access   Public
exports.getHotelsByPriceRange = async (req, res, next) => {
  const { minPrice, maxPrice } = req.query;

  try {
    if (!minPrice || !maxPrice) {
      return res.status(400).json({
        success: false,
        error: "Both minPrice and maxPrice must be provided",
      });
    }

    const hotels = await Hotel.find({
      $or: [
        { minPrice: { $lte: maxPrice, $gte: minPrice } },
        { maxPrice: { $lte: maxPrice, $gte: minPrice } },
      ],
    });

    res.status(200).json({ success: true, data: hotels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

//@desc     Get Random Hotel
//@route    Get /api/v1/hotels/random
//@access   Public
exports.getRandomHotel = async (req, res, next) => {
  const count = req.query.count;

  try {
    const hotels = await Hotel.aggregate([
      { $sample: { size: Number(count) } },
    ]);

    res.status(200).json({ success: true, data: hotels });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
