const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

// @route   POST api/auth/register
// @desc    Register user
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("gender", "Gender is required").not().isEmpty(),
    check("age", "Age must be a number and at least 18").isInt({ min: 18 }),
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Password must be 6+ chars with uppercase, lowercase, number, and special char"
    ).matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    ),
    check("phoneNumber", "Phone number must be 10 digits").isLength({
      min: 10,
      max: 10,
    }),
    check("securityQuestion", "Security question is required").not().isEmpty(),
    check("securityAnswer", "Security answer is required").not().isEmpty(),
    check("role", "Role must be farmer or buyer").isIn(["farmer", "buyer"]),
    check("houseNo", "House number is required").not().isEmpty(),
    check("street", "Street is required").not().isEmpty(),
    check("mandalDistrict", "Mandal/District is required").not().isEmpty(),
    check("state", "State is required").not().isEmpty(),
    check("zipcode", "Zipcode must be 6 digits").matches(/^[0-9]{6}$/),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      gender,
      age,
      username,
      email,
      password,
      phoneNumber,
      securityQuestion,
      securityAnswer,
      role,
      houseNo,
      street,
      mandalDistrict,
      state,
      zipcode,
    } = req.body;

    try {
      let user = await User.findOne({ $or: [{ email }, { username }] });
      if (user) {
        return res.status(400).json({
          errors: [{ msg: "User already exists with this email or username" }],
        });
      }

      user = new User({
        name,
        gender,
        age,
        username,
        email,
        password,
        phoneNumber,
        securityQuestion,
        securityAnswer,
        role,
        address: {
          houseNo,
          street,
          mandalDistrict,
          state,
          zipcode,
        },
      });

      await user.save();

      const payload = { user: { username: user.username, role: user.role } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5d" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, username: user.username, role: user.role });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post(
  "/login",
  [
    check("username", "Please include a valid username or email")
      .not()
      .isEmpty(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      });

      if (!user || password !== user.password) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      const payload = { user: { username: user.username, role: user.role } };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: "5d" },
        (err, token) => {
          if (err) throw err;
          res.json({ token, username: user.username, role: user.role });
        }
      );
    } catch (err) {
      console.error("Login Error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route POST api/auth/forgot-password
router.post(
  "/forgot-password",
  [
    check("username", "Username or email is required").not().isEmpty(),
    check("securityQuestion", "Security question is required").not().isEmpty(),
    check("securityAnswer", "Security answer is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    try {
      const { username, securityQuestion, securityAnswer } = req.body;
      const user = await User.findOne({
        $or: [{ username }, { email: username }],
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "User not found with this username/email",
        });
      }

      if (
        user.securityQuestion !== securityQuestion ||
        user.securityAnswer.toLowerCase() !== securityAnswer.toLowerCase()
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid security question or answer",
        });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      user.resetToken = resetToken;
      user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
      await user.save();

      res.json({
        success: true,
        message: "Verification successful. Reset token generated.",
        username: user.username,
        role: user.role,
        resetToken,
      });
    } catch (err) {
      console.error("Forgot Password Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error during password reset verification",
      });
    }
  }
);

// @route GET api/auth/verify-reset-user/:username/:token
router.get("/verify-reset-user/:username/:token", async (req, res) => {
  try {
    const username = decodeURIComponent(req.params.username);
    const token = req.params.token;

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ valid: false });
    }

    return res.json({
      valid: true,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ valid: false });
  }
});

// @route PUT api/auth/reset-password/:username/:token
router.put(
  "/reset-password/:username/:token",
  [
    check(
      "newPassword",
      "Password must be 6+ chars with uppercase, lowercase, number, and special char"
    ).matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/
    ),
    check("confirmPassword", "Passwords must match").custom(
      (value, { req }) => value === req.body.newPassword
    ),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: errors.array(),
      });
    }

    try {
      const { newPassword } = req.body;
      const username = decodeURIComponent(req.params.username);
      const token = req.params.token;

      const user = await User.findOne({
        $or: [{ username }, { email: username }],
        resetToken: token,
        resetTokenExpiry: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      user.password = newPassword;
      user.resetToken = undefined;
      user.resetTokenExpiry = undefined;
      await user.save();

      res.json({
        success: true,
        message: "Password updated successfully",
        role: user.role,
      });
    } catch (err) {
      console.error("Reset Password Error:", err.message);
      res.status(500).json({
        success: false,
        message: "Server error during password reset",
      });
    }
  }
);

// @route PUT api/auth/update/:username
// @desc Update user's email, phone, or address
router.put("/update/:username", async (req, res) => {
  try {
    const { email, phoneNumber, address } = req.body;
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    });
  } catch (err) {
    console.error("Profile Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route GET api/auth/user/:username
// @desc Get user details by username
router.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -resetToken -resetTokenExpiry"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
// ========================= FARMER COMPATIBILITY ROUTES ========================= //

// @route GET api/farmers/:username
// @desc Get farmer profile (compatible with frontend)
router.get("/farmers/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password -resetToken -resetTokenExpiry"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("Fetch Farmer Profile Error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route PUT api/farmers/:username
// @desc Update farmer profile (email, phone, address)
router.put("/farmers/:username", async (req, res) => {
  try {
    const { email, phoneNumber, address } = req.body;
    const username = req.params.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
    });
  } catch (err) {
    console.error("Update Farmer Profile Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
// @route GET api/buyers/:username
// @desc Get buyer profile
router.get("/buyers/:username", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username,
      role: "buyer",
    }).select("-password -resetToken -resetTokenExpiry");
    if (!user) return res.status(404).json({ message: "Buyer not found" });
    res.json(user);
  } catch (err) {
    console.error("Buyer Profile Fetch Error:", err.message);
    res.status(500).send("Server error");
  }
});

// @route PUT api/buyers/:username
// @desc Update buyer profile (email, phone)
// @route PUT api/auth/buyers/:username
// @desc Update buyer profile (email, phone, address)
router.put("/buyers/:username", async (req, res) => {
  try {
    console.log("Incoming update for buyer:", req.body);

    const { email, phoneNumber, address } = req.body;
    const username = req.params.username;

    const user = await User.findOne({ username, role: "buyer" });
    if (!user) return res.status(404).json({ message: "Buyer not found" });

    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address; // ✅ added this

    await user.save();

    res.json({
      success: true,
      message: "Buyer profile updated successfully",
      user: {
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address, // ✅ return updated address
      },
    });
  } catch (err) {
    console.error("Buyer Profile Update Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});
const authMiddleware = require("../middleware/authMiddleware"); // Middleware to verify token

// ✅ Get the logged-in user's details
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // Return the full user data (with address)
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
