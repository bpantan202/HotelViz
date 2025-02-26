const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const {
  addCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  redeemCoupon,
  deleteCoupon,
  deleteCouponsByType,
  updateCouponsByType,
  getCouponSummary,
  getSingleCouponSummary,
} = require("../controllers/coupons");
const { login, register, updateUser } = require("../controllers/auth");
const User = require("../models/User");

let session = {
  _id: null,
  role: null,
};

let couponId = null;

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
    query: {
      select: null,
    },
    queryPolluted: {
      amenities: null,
    },
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
        password: "password123",
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

describe("Coupon", () => {
  beforeAll(async () => {
    dotenv.config({ path: "./config/config.env" });
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await User.deleteMany();
    await Coupon.deleteMany();

    //create admin
    await createRequest(register, {
      body: {
        name: "admin",
        tel: "123-456-7890",
        email: "admin@gmail.com",
        password: "password123",
        role: "admin",
      },
    });

    //create user
    await createRequest(register, {
      body: {
        name: "user1",
        tel: "123-456-7890",
        email: "user1@gmail.com",
        password: "password123",
        role: "user",
      },
    });
  });

  afterAll(async () => {
    await User.deleteMany();
    await Coupon.deleteMany();
    await mongoose.connection.close();
  });

  describe("Coupon Model", () => {
    it("should create coupon model successfully", async () => {
      let error;
      try {
        const coupon = await Coupon.create({
          numberOfCoupons: 4,
          type: "coupon1",
          discount: 20,
          tiers: ["Gold", "Platinum"],
          point: 100,
          expiredDate: "2025-04-29T00:00:00.000Z",
        });
        await coupon.save();
      } catch (err) {
        error = err;
      }
      expect(error).toBe(undefined);
      let coupon2 = await Coupon.findOne({ type: "coupon1" });
      expect(coupon2).not.toBe(null);
      couponId = coupon2.id;
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Create coupon", () => {
    it("should create a coupon and return status 201", async () => {
      await loginAdmin();
      const res = await createRequest(addCoupon, {
        body: {
          numberOfCoupons: 4,
          type: "coupon2",
          discount: 20,
          tiers: ["Bronze", "Gold", "Platinum"],
          point: 100,
          expiredDate: "2025-04-29T00:00:00.000Z",
        },
      });

      expect(res.status).toBe(201);
      expect(await Coupon.findOne({ type: "coupon2" })).not.toBe(null);
    });

    it("should prevent from creating a coupon with wrong format and return status 400", async () => {
      const res = await createRequest(addCoupon, {
        body: {
          numberOfCoupons: 4,
          discount: 20,
          tiers: ["Gold", "Platinum"],
          point: 100,
          expiredDate: "2025-04-29T00:00:00.000Z",
        },
      });

      expect(res.status).toBe(400);
    });

    it("should create a coupon and return status 201", async () => {
      const res = await createRequest(addCoupon, {
        body: {
          numberOfCoupons: 4,
          type: "coupon2",
          discount: 20,
          tiers: ["Gold", "Platinum"],
          point: 100,
          expiredDate: "2025-04-29T00:00:00.000Z",
        },
      });

      expect(res.status).toBe(400);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Redeem coupon", () => {
    it("should redeem coupon with coupon type and return status 200", async () => {
      await loginUser();

      //give user free point
      await createRequest(updateUser, {
        body: {
          point: 3000,
        },
      });

      const res = await createRequest(redeemCoupon, {
        params: { couponType: "coupon2" },
      });

      couponId = res.json.coupon;

      expect(res.status).toBe(201);
      expect((await Coupon.findById(res.json.coupon)).owner.valueOf()).toBe(
        session._id.valueOf()
      );
    });

    it("should prevent from redeeming unavailable coupon and return status 404", async () => {
      const res = await createRequest(redeemCoupon, {
        params: { couponType: "coupon0" },
      });

      expect(res.status).toBe(404);
    });

    it("should allow admin to redeem coupon for other user with coupon type and return status 201", async () => {
      await loginAdmin();

      const res = await createRequest(redeemCoupon, {
        params: { couponType: "coupon2" },
        body: {
          user: (await User.findOne({ name: "user1" })).id,
        },
      });

      expect(res.status).toBe(201);
      expect((await Coupon.findById(res.json.coupon)).owner.valueOf()).toBe(
        (await User.findOne({ name: "user1" })).id.valueOf()
      );
    });

    it("should prevent user from redeeming ineligible coupon and return status 400", async () => {
      await loginUser();

      await createRequest(addCoupon, {
        body: {
          numberOfCoupons: 4,
          type: "coupon3",
          discount: 20,
          tiers: ["Gold", "Platinum"],
          point: 100,
          expiredDate: "2025-04-29T00:00:00.000Z",
        },
      });

      const res = await createRequest(redeemCoupon, {
        params: { couponType: "coupon3" },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent user without enough point from redeeming coupon and return status 400", async () => {
      await createRequest(addCoupon, {
        body: {
          numberOfCoupons: 1,
          type: "coupon4",
          discount: 20,
          tiers: ["Bronze", "Gold", "Platinum"],
          point: 99999999,
          expiredDate: "2025-04-29T00:00:00.000Z",
        },
      });

      const res = await createRequest(redeemCoupon, {
        params: { couponType: "coupon4" },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent user from redeeming coupon with incorrect coupon type format and return status 500", async () => {
      const res = await createRequest(redeemCoupon, {
        params: { couponType: { fake: "rfdsdg" } },
      });

      expect(res.status).toBe(500);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Get coupons", () => {
    it("user should get their coupons and return status 200", async () => {
      await loginUser();

      const res = await createRequest(getCoupons);

      expect(res.status).toBe(200);
      expect(res.json.count).toBe(2);
      expect(res.json.data[0].type).toBe("coupon2");
    });

    it("should allow admin to get all coupons and return status 200", async () => {
      await loginAdmin();

      const res = await createRequest(getCoupons);

      expect(res.status).toBe(200);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Get coupon", () => {
    it("should get coupon with coupon id and return status 200", async () => {
      const res = await createRequest(getCoupon, { params: { id: couponId } });

      expect(res.status).toBe(200);
      expect(res.json.data.type).toBe("coupon2");
    });

    it("should give error message from getting coupon with invalid coupon id and return status 404", async () => {
      const res = await createRequest(getCoupon, {
        params: { id: "000000000000000000000000" },
      });

      expect(res.status).toBe(404);
    });

    it("should give error message from getting coupon with incorrect coupon id format and return status 404", async () => {
      const res = await createRequest(getCoupon, {
        params: { id: "incorrect" },
      });

      expect(res.status).toBe(500);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Update coupon", () => {
    it("should allow admin to update coupon and return status 200", async () => {
      await loginAdmin();

      const res = await createRequest(updateCoupon, {
        params: { id: couponId },
        body: { discount: 40 },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.discount).toBe(40);
      expect((await Coupon.findById(res.json.data.id)).discount).toBe(40);
    });

    it("should prevent from updating coupon invalid coupon id and return status 404", async () => {
      const res = await createRequest(updateCoupon, {
        params: { id: "000000000000000000000000" },
        body: { discount: 40 },
      });

      expect(res.status).toBe(404);
    });

    it("should prevent from updating coupon incorrect coupon id format and return status 500", async () => {
      const res = await createRequest(updateCoupon, {
        params: { id: "gbfddfgfdg" },
        body: { discount: 40 },
      });

      expect(res.status).toBe(500);
    });

    it("should allow user to update coupon's used filed and return status 200", async () => {
      await loginUser();

      const res = await createRequest(updateCoupon, {
        params: { id: couponId },
        body: { used: true },
      });

      expect(res.status).toBe(200);
      expect(res.json.data.used).toBe(true);
      expect((await Coupon.findById(res.json.data.id)).used).toBe(true);
    });

    it("should prevent user from updating other user's coupon or used coupon and return status 401", async () => {
      const res = await createRequest(updateCoupon, {
        params: { id: (await Coupon.findOne({ type: "coupon1" })).id },
        body: { used: true },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Update coupon by type", () => {
    it("should allow admin to update coupon type and return status 200", async () => {
      await loginAdmin();

      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon2" },
        body: { discount: 60 },
      });

      expect(res.status).toBe(200);
      expect((await Coupon.findOne({ type: "coupon2" })).discount).toBe(60);
    });

    it("should allow admin to change coupon type name and return status 200", async () => {
      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon4" },
        body: { type: "coupon5" },
      });

      expect(res.status).toBe(200);
      expect(await Coupon.findOne({ type: "coupon5" })).not.toBe(null);
    });

    it("should prevent admin from changing coupon type name to be duplicate and return status 400", async () => {
      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon2" },
        body: { type: "coupon5" },
      });

      expect(res.status).toBe(400);
    });

    it("should prevent admin from updating invalid coupon type and return status 404", async () => {
      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon0" },
        body: { discount: 20 },
      });

      expect(res.status).toBe(404);
    });

    it("should prevent admin from updating coupon with incorrect coupon type format and return status 500", async () => {
      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon0" },
        body: { discount: { kesg: "gsfd" } },
      });

      expect(res.status).toBe(500);
    });

    it("should prevent user from updating coupon type and return status 401", async () => {
      await loginUser();

      const res = await createRequest(updateCouponsByType, {
        params: { couponType: "coupon2" },
        body: { discount: 0 },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Delete coupon", () => {
    it("should allow admin to delete coupon and return status 200", async () => {
      await loginAdmin();

      let coupon1 = (await Coupon.findOne({ type: "coupon1" })).id;
      const res = await createRequest(deleteCoupon, {
        params: { id: coupon1 },
      });

      expect(res.status).toBe(200);
      expect(await Coupon.findById(coupon1)).toBe(null);
    });

    it("should prevent admin from deleting invalid coupon and return status 404", async () => {
      const res = await createRequest(deleteCoupon, {
        params: { id: await Coupon.findOne({ type: "coupon1" }) },
      });

      expect(res.status).toBe(404);
    });

    it("should prevent from deleting coupon with incorrect coupon id format and return status 500", async () => {
      const res = await createRequest(deleteCoupon, {
        params: { id: "dsfsdfsdfsdf" },
      });

      expect(res.status).toBe(500);
    });

    it("should prevent default user from deleting coupon and return status 401", async () => {
      await loginUser();

      const res = await createRequest(deleteCoupon, {
        params: { id: await Coupon.findOne({ type: "coupon2" }) },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Delete coupon by type", () => {
    it("should allow admin to delete coupon type and return status 200", async () => {
      await loginAdmin();

      const res = await createRequest(deleteCouponsByType, {
        params: { couponType: "coupon3" },
      });

      expect(res.status).toBe(200);
      expect(await Coupon.findOne({ type: "coupon3" })).toBe(null);
    });

    it("should prevent admin from deleting invalid coupon type and return status 404", async () => {
      const res = await createRequest(deleteCouponsByType, {
        params: { couponType: "coupon3" },
      });

      expect(res.status).toBe(404);
    });

    it("should prevent admin from deleting incorrect coupon type format and return status 500", async () => {
      const res = await createRequest(deleteCouponsByType, {
        params: { couponType: { fake: "dfgdf" } },
      });

      expect(res.status).toBe(500);
    });

    it("should prevent user from deleting coupon type and return status 401", async () => {
      await loginUser();

      const res = await createRequest(deleteCouponsByType, {
        params: { couponType: "coupon5" },
      });

      expect(res.status).toBe(401);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Get all coupon summary", () => {
    it("should get all coupon summary and return status 200", async () => {
      const res = await createRequest(getCouponSummary);

      expect(res.status).toBe(200);
      expect(res.json.data[0]).not.toBe(null);
    });
  });

  //------------------------------------------------------------------------------------------------------------------------
  describe("Get coupon summary by type", () => {
    it("should get single coupon summary and return status 200", async () => {
      const res = await createRequest(getSingleCouponSummary, {
        params: { couponType: "coupon2" },
      });

      expect(res.status).toBe(200);
      expect(res.json.data._id).toBe("coupon2");
    });

    it("should give error message from getting single coupon summary with invalid coupon type and return status 404", async () => {
      const res = await createRequest(getSingleCouponSummary, {
        params: { couponType: "coupon0" },
      });

      expect(res.status).toBe(404);
    });
  });
});
