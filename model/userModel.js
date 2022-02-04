const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");
const cryptoUtils = require("../utils/cryptoUtils.js");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return validator.isAlpha(val, ["en-US"], { ignore: " " });
      },
      msg: " Name path can only contain english letters - no numbers and special characters",
    },
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (val) {
        return validator.isEmail(val);
      },
      msg: "Please provide a valid email",
    },
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user", "lead_guide", "guide"],
    select: false,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  photo: {
    type: "String",
    default: "/img/users/default-user.jpg",
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false,
  },
  confirmPass: {
    type: String,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      msg: "paths /confirmPass and password/ don't match or not provided !",
    },
    required: true,
  },
  lastChanged: {
    type: Date,
    select: false,
  },
  resetToken: {
    type: String,
    select: false,
  },
  resetExpAt: Date,
});

// Middleware that hashes the password before saving it
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.isNew) {
    this.password = await cryptoUtils.hashPass(this.password);
    this.confirmPass = undefined;
  }

  next();
});

// Middleware that runs on password reset
userSchema.pre("save", async function (next) {
  if (this.isModified("password") && !this.isNew) {
    this.password = await cryptoUtils.hashPass(this.password);
    this.lastChanged = Date.now() - 1000 * 5;
    this.confirmPass = undefined;
  }

  next();
});

// Static method on the model for validating user credentials
userSchema.statics.checkUser = async function (data) {
  const user = await this.findOne({ email: data.email }).select(
    "+password"
  );
  let result;
  if (user && data.password)
    result = await cryptoUtils.checkPass(
      data.password,
      user.password
    );
  if (result) return user;
};

// Static method for finding user by their unique reset token
userSchema.statics.findByToken = async function (token) {
  const encToken = cryptoUtils.encryptResetToken(token);
  const user = await this.findOne({ resetToken: encToken });
  return user;
};

// Instance method that checks if password has been changed after the token was created
userSchema.methods.changedPassAfter = function (token) {
  if (!this.lastChanged) return false;

  const dateChanged = Date.parse(this.lastChanged) / 1000;

  return token.iat < dateChanged;
};

// Instance method that creates password reset token
userSchema.methods.generatePassResetToken = async function () {
  const randToken = await cryptoUtils.createResetToken();
  const encrToken = cryptoUtils.encryptResetToken(randToken);

  this.resetToken = encrToken;
  // expire in 10 minutes
  this.resetExpAt = Date.now() + 1000 * 60 * 10;

  await this.save({ validateBeforeSave: false });

  return randToken;
};

// Instance method that checks if reset token has not expired
userSchema.methods.validatePassResetToken = function () {
  const tkExpAt = Date.parse(this.resetExpAt);

  return Date.now() > tkExpAt;
};

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
