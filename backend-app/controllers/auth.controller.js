// backend-app/controllers/auth.controller.js

const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * User Registration Controller
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user registration data
 * @param {string} req.body.username - User's chosen username
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (plain text)
 * @param {Object} res - Express response object
 * @returns {Object} Registration status and user data (excluding password)
 */
exports.register = async (req, res) => {
  try {
    // Validate if user exists in database
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(409).send({
        message: "User with this email already exists.",
      });
    }

    // Generate salt and hash password for security
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user record with hashed password
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: "standard", // Default role for new users
    });

    // Return success response with safe user data
    res.status(201).send({
      message: "User registered successfully!",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).send({
      message: "Error during registration. Please try again.",
    });
  }
};

/**
 * User Login Controller
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (plain text)
 * @param {Object} res - Express response object
 * @returns {Object} Login status, user data, and JWT token
 */
exports.login = async (req, res) => {
  try {
    // Find user by email in database
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found. Please check your email.",
      });
    }

    // Verify password against stored hash
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid password. Please try again.",
      });
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: 86400 } // Token expires in 24 hours
    );

    // Return success response with token and safe user data
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({
      message: "Error during login. Please try again later.",
    });
  }
};
