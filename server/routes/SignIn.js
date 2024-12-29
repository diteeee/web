require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { User } = require("../models");
const router = express.Router();
const logger = require("../config/logger");

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  logger.info("Request received:", req.body);

  try {
    let user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn("No user found for email:", email);
      return res
        .status(400)
        .json({ success: false, message: "No user found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      logger.warn("Password does not match for email:", email);
      return res
        .status(400)
        .json({ success: false, message: "Password does not match" });
    }

    const role = user.role;

    const token = jwt.sign(
      {
        userID: user.userID,
        role,
        email: user.email,
        emri: user.emri,
        mbiemri: user.mbiemri,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    logger.info("Sign-in successful for email:", email);
    res.json({ success: true, token });
  } catch (error) {
    logger.error("Sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred during sign-in. Please try again later.",
    });
  }
});

module.exports = router;
