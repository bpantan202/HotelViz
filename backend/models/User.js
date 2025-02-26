const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  tel: {
    type: String,
    required: [true, "Please add a telephone number"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  tier: {
    type: String,
    enum: ["Bronze", "Silver", "Gold", "Platinum"],
    default: "Bronze",
  },
  experience: {
    type: Number,
    default: 0,
  },
  point: {
    type: Number,
    default: 0,
  },
  coupons: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Coupon",
    },
  ],
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function upgradeTier(experience) {
  let tier = "None";
  if (experience >= 500) tier = "Platinum";
  else if (experience >= 200) tier = "Gold";
  else if (experience >= 50) tier = "Silver";
  else tier = "Bronze";
  return tier;
}

//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  this.tier = upgradeTier(this.experience);

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  update.tier = upgradeTier(update.experience);
  
  next();
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.changePassword = async function (
  current_password,
  new_password
) {
  const isMatch = await this.matchPassword(current_password);
  if (!isMatch) {
    return false;
  } else {
    this.password = new_password;

    await this.save();
    return true;
  }
};

module.exports = mongoose.model("User", UserSchema);
