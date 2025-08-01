const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 50,
  },
  gender: {
    type: String,
    required: [true, "Please provide gender"],
    enum: ["male", "female", "other"],
  },
  age: {
    type: Number,
    required: [true, "Please provide age"],
    min: [18, "Age must be at least 18"],
  },
  username: {
    type: String,
    required: [true, "Please provide username"],
    unique: true,
    minlength: 3,
    maxlength: 20,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    validate: {
      validator: function (v) {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(
          v
        );
      },
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    },
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number"],
    validate: {
      validator: function (v) {
        return /^[0-9]{10}$/.test(v);
      },
      message: "Please provide valid 10-digit phone number",
    },
  },
  securityQuestion: {
    type: String,
    required: [true, "Please provide security question"],
  },
  securityAnswer: {
    type: String,
    required: [true, "Please provide security answer"],
  },
  role: {
    type: String,
    enum: ["farmer", "buyer"],
    required: [true, "Please specify if you are a farmer or buyer"],
  },
  address: {
    houseNo: { type: String, required: [true, "House number is required"] },
    street: { type: String, required: [true, "Street is required"] },
    mandalDistrict: {
      type: String,
      required: [true, "Mandal/District is required"],
    },
    state: { type: String, required: [true, "State is required"] },
    zipcode: {
      type: String,
      required: [true, "Zipcode is required"],
      validate: {
        validator: function (v) {
          return /^[0-9]{6}$/.test(v);
        },
        message: "Please provide valid 6-digit zipcode",
      },
    },
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model("User", UserSchema);
