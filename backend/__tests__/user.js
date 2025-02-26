const dotenv = require("dotenv");
const mongoose = require("mongoose");
const User = require("../models/User");
const Coupon = require("../models/Coupon");
const Hotel = require("../models/Hotel");
const Booking = require("../models/Booking");
const {
  register,
  login,
  reset,
  updateUser,
  logout,
  deleteUser,
  getMe,
} = require("../controllers/auth");

let session = {
  _id: null,
  role: null,
};

let hotelId = null;

class Response {
  constructor() {
    this.statusCode = 200;
    this.body = {};
    this.cookies = [];
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  json(data) {
    this.body = data;
    return this;
  }

  cookie(name, value, options = {}) {
    const cookie = {
      name,
      value,
      options,
    };
    this.cookies.push(cookie);
    return this;
  }
}

async function createRequest(func, request = {}) {
  let req = {
    user: {
      id: session._id,
      role: session.role,
    },
    params: {
      id: null,
    },
    body: {},
    query: {},
    queryPolluted: {},
  };
  req = { ...req, ...request };
  let res = new Response();
  const next = jest.fn();

  await func(req, res, next);

  return { status: res.statusCode, json: res.body, cookies: res.cookies };
}

async function loginUser() {
  session = (
    await createRequest(login, {
      body: {
        email: "user1@gmail.com",
        password: "newpassword",
      },
    })
  ).json;
}

async function loginAdmin() {
  session = (
    await createRequest(login, {
      body: {
        email: "admin@gmail.com",
        password: "password123",
      },
    })
  ).json;
}

async function createHotel(req, res, next) {
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
}

async function deleteHotel(req, res, next) {
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
}

async function addBooking(req, res, next) {
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
}

describe("User", () => {
  beforeAll(async () => {
    dotenv.config({ path: "./config/config.env" });
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany();
    await Coupon.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();
  });

  afterAll(async () => {
    await User.deleteMany();
    await Coupon.deleteMany();
    await Hotel.deleteMany();
    await Booking.deleteMany();
    await mongoose.connection.close();
  });

  describe("User Model", () => {
    it("should create user model successfully", async () => {
      let error;
      try {
        const user = await User.create({
          name: "admin",
          tel: "123-456-7890",
          email: "admin@gmail.com",
          password: "password123",
          role: "admin",
        });
        await user.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBe(undefined);
      expect(await User.findOne({ name: "admin" })).not.toBe(null);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Register user", () => {
    it("should register a user and return status 201", async () => {
      const res = await createRequest(register, {
        body: {
          name: "user1",
          tel: "123-456-7890",
          email: "user1@gmail.com",
          password: "password123",
          role: "user",
        },
      });

      expect(res.status).toBe(201);
      expect(await User.findOne({ name: "user1" })).not.toBe(null);
    });

    it("should prevent user from register with same email and return status 400", async () => {
      const res = await createRequest(register, {
        body: {
          name: "testduplicate",
          tel: "123-456-7890",
          email: "user1@gmail.com",
          password: "password123",
          role: "user",
        },
      });

      expect(res.status).toBe(400);
      expect(await User.findOne({ name: "testduplicate" })).toBe(null);
    });

    it("should prevent user from register with incorrect format and return status 400", async () => {
      const res = await createRequest(register, {
        body: {
          name: "testcannotcreateuser",
          tel: "123-456-7890",
          email: "test",
          password: "password123",
          role: "user",
        },
      });

      expect(res.status).toBe(400);
      expect(await User.findOne({ name: "testcannotcreateuser" })).toBe(null);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Login user", () => {
    it("should login user and return status 200", async () => {
      const res = await createRequest(login, {
        body: {
          email: "user1@gmail.com",
          password: "password123",
        },
      });

      session = res.json;

      expect(res.status).toBe(200);
      expect(res.json.email).toBe("user1@gmail.com");
      expect(session.email).toBe("user1@gmail.com");
    });

    it("should prevent user from login with incorrect request body and return status 400", async () => {
      const res = await createRequest(login, {
        body: {
          password: "password123",
        },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent user from login with invalid email and return status 400", async () => {
      const res = await createRequest(login, {
        body: {
          email: "wrongemail@gmail.com",
          password: "wrongpassword",
        },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent user from login with incorrect password and return status 401", async () => {
      const res = await createRequest(login, {
        body: {
          email: "user1@gmail.com",
          password: "wrongpassword",
        },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Logout user", () => {
    it("should logout user and return status 200", async () => {
      const res = await createRequest(logout);

      expect(res.status).toBe(200);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Reset password", () => {
    it("should set new password and return status 201", async () => {
      session = (
        await createRequest(login, {
          body: {
            email: "user1@gmail.com",
            password: "password123",
          },
        })
      ).json;

      const res = await createRequest(reset, {
        body: {
          current_password: "password123",
          new_password: "newpassword",
        },
      });

      expect(res.status).toBe(200);

      //login with new password
      const res2 = await createRequest(login, {
        body: {
          email: "user1@gmail.com",
          password: "newpassword",
        },
      });

      expect(res2.status).toBe(200);
    });

    it("should prevent from set new password with incorrect current password and return status 401", async () => {
      const res = await createRequest(reset, {
        body: {
          current_password: "password123",
          new_password: "newpassword",
        },
      });

      expect(res.status).toBe(401);
    });

    it("should prevent from set new password without current password and return status 400", async () => {
      const res = await createRequest(reset, {
        body: {
          new_password: "newpassword",
        },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent from set new password without logged-in and return status 500", async () => {
      session._id = null;
      const res = await createRequest(reset, {
        body: {
          current_password: "password123",
          new_password: "newpassword",
        },
      });

      await loginUser();

      expect(res.status).toBe(500);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Update user", () => {
    it("should update user and return status 200", async () => {
      await loginUser();
      const res = await createRequest(updateUser, {
        body: {
          tel: "000-000-0000",
        },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.tel).toBe("000-000-0000");
      expect((await User.findById(session._id)).tel).toBe("000-000-0000");
    });

    it("should prevent user from update without logged-in and return status 400", async () => {
      session._id = null;
      const res = await createRequest(updateUser, {
        body: {
          tel: "111-111-1111",
        },
      });

      await loginUser();

      expect(res.status).toBe(400);
    });

    it("should prevent user from update with incorrect body format and return status 400", async () => {
      const res = await createRequest(updateUser, {
        body: { tel: { test: "sfgdf" } },
      });

      expect(res.status).toBe(400);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Delete user", () => {
    it("should delete user and return status 200", async () => {
      await createRequest(register, {
        body: {
          name: "user2",
          tel: "123-456-7890",
          email: "user2@gmail.com",
          password: "password123",
          role: "user",
        },
      });

      session = (
        await createRequest(login, {
          body: {
            email: "user2@gmail.com",
            password: "password123",
          },
        })
      ).json;

      const res = await createRequest(deleteUser, {
        body: {
          password: "password123",
        },
      });

      expect(res.status).toBe(200);
    });

    it("should prevent user from delete without logged-in and return status 400", async () => {
      const res = await createRequest(deleteUser, {
        body: {
          password: "newpassword",
        },
      });

      expect(res.status).toBe(500);

      // login other account
      await loginAdmin();
    });

    it("should prevent from delete user without password and return status 400", async () => {
      const res = await createRequest(deleteUser);

      expect(res.status).toBe(400);
    });

    it("should prevent from delete user with incorrect password and return status 401", async () => {
      const res = await createRequest(deleteUser, {
        body: {
          password: "wrongpassword",
        },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Test tier upgrade based on user experience", () => {
    it("Upgrade to Bronze", async () => {
      const res = await createRequest(updateUser, {
        body: {
          experience: 10,
        },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.tier).toBe("Bronze");
      expect((await User.findById(session._id)).tier).toBe("Bronze");
    });

    it("Upgrade to Silver", async () => {
      const res = await createRequest(updateUser, {
        body: {
          experience: 70,
        },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.tier).toBe("Silver");
      expect((await User.findById(session._id)).tier).toBe("Silver");
    });

    it("Upgrade to Gold", async () => {
      const res = await createRequest(updateUser, {
        body: {
          experience: 300,
        },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.tier).toBe("Gold");
      expect((await User.findById(session._id)).tier).toBe("Gold");
    });

    it("Upgrade to Platinum", async () => {
      const res = await createRequest(updateUser, {
        body: {
          experience: 600,
        },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.tier).toBe("Platinum");
      expect((await User.findById(session._id)).tier).toBe("Platinum");
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Get Me", () => {
    it("should get user data with token", async () => {
      const res = await createRequest(getMe);

      expect(res.status).toBe(200);
      expect(res.json.data.email).toBe(session.email);
    });

    it("should prevent from getting user data without token", async () => {
      session._id = null;
      const res = await createRequest(getMe);

      expect(res.status).toBe(400);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("(US2-2)Test experience earning each booking", () => {
    it("(TC1)member is logged in and have enough point from booking to upgrade tier", async () => {
      //create hotel
      await loginAdmin();
      hotelId = (
        await createRequest(createHotel, {
          body: {
            name: "hotel2",
            address: "address2",
            district: "district2",
            province: "province2",
            postalcode: "22222",
            tel: "222-222-2222",
            region: "region2",
            image: "https://drive.google.com/uc?id=imageLink",
          },
        })
      ).json.data.id;

      await loginUser();
      let user = await User.findById(session._id);

      // reset experience
      await createRequest(updateUser, {
        body: {
          experience: 0,
        },
      });
      expect(user.tier).toBe("Bronze");

      //add booking
      await createRequest(addBooking, {
        params: { hotelId: hotelId },
        body: {
          date: "2025-04-29T00:00:00.000Z",
          contactEmail: "user1@gmail.com",
          contactName: "user1",
          contactTel: "222-222-2222",
          roomType: "room1",
          price: 5000,
          discount: 0,
        },
      });

      user = await User.findById(session._id);
      expect(user.tier).toBe("Silver");
    });

    it("(TC2)member is logged in but does not make bookin to upgrade tier", async () => {
      await loginUser();
      let user = await User.findById(session._id);
      expect(user.tier).toBe("Silver");

      user = await User.findById(session._id);
      expect(user.tier).toBe("Silver");
    });

    it("(TC3)member is logged in but does not have enough point from booking to upgrade tier", async () => {
      await loginUser();
      let user = await User.findById(session._id);
      expect(user.tier).toBe("Silver");

      //add booking
      await createRequest(addBooking, {
        params: { hotelId: hotelId },
        body: {
          date: "2025-04-29T00:00:00.000Z",
          contactEmail: "user1@gmail.com",
          contactName: "user1",
          contactTel: "222-222-2222",
          roomType: "room1",
          price: 5000,
          discount: 0,
        },
      });

      user = await User.findById(session._id);
      expect(user.tier).toBe("Silver");
    });

    it("(TC4)member does not logged in but make booking (will not upgrade tier)", async () => {
      let user = await User.findById(session._id);
      session._id = null;

      expect(user.tier).toBe("Silver");
      //add booking
      let res = await createRequest(addBooking, {
        params: { hotelId: hotelId },
        body: {
          date: "2025-04-29T00:00:00.000Z",
          contactEmail: "user1@gmail.com",
          contactName: "user1",
          contactTel: "222-222-2222",
          roomType: "room1",
          price: 5000,
          discount: 0,
        },
      });
      expect(res.status).toBe(400);
      expect(user.tier).toBe("Silver");
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("(US2-3)Test points earning each booking", () => {
    it("(TC1)member is logged in and earning points from booking", async () => {
      await loginUser();
      let user = await User.findById(session._id);
      expect(user.point).toBe(1000);

      //add booking
      await createRequest(addBooking, {
        params: { hotelId: hotelId },
        body: {
          date: "2025-04-29T00:00:00.000Z",
          contactEmail: "user1@gmail.com",
          contactName: "user1",
          contactTel: "222-222-2222",
          roomType: "room1",
          price: 5000,
          discount: 0,
        },
      });

      user = await User.findById(session._id);
      expect(user.point).toBe(1500);
    });

    it("(TC2)member is logged in but does not make booking to earn points", async () => {
      await loginUser();
      let user = await User.findById(session._id);
      expect(user.point).toBe(1500);

      user = await User.findById(session._id);
      expect(user.point).toBe(1500);
    });

    it("(TC3)member does not logged in but make booking (will not earn points)", async () => {
      let user = await User.findById(session._id);
      session._id = null;

      expect(user.point).toBe(1500);
      //add booking
      let res = await createRequest(addBooking, {
        params: { hotelId: hotelId },
        body: {
          date: "2025-04-29T00:00:00.000Z",
          contactEmail: "user1@gmail.com",
          contactName: "user1",
          contactTel: "222-222-2222",
          roomType: "room1",
          price: 5000,
          discount: 0,
        },
      });
      expect(res.status).toBe(400);
      expect(user.point).toBe(1500);

      //delete hotel
      await loginAdmin();
      await createRequest(deleteHotel, {
        params: { id: hotelId },
      });
    });
  });
});
