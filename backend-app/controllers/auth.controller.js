// backend-app/controllers/auth.controller.js

const db = require("../models");
const User = db.User;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// --- User Registration Logic ---
exports.register = async (req, res) => {
  try {
    // 1. Check if user already exists (by email or username)
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res
        .status(409)
        .send({ message: "User with this email already exists." });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // 3. Create the new user in the database
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      // role defaults to 'standard'
    });

    // 4. Respond with success (do NOT send the password)
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
    res.status(500).send({ message: "Error during registration." });
  }
};

// --- User Login Logic ---
exports.login = async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // 2. Compare the submitted password with the hashed password
    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    // 3. Create a JSON Web Token (JWT)
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET, // Using the secret key from your .env file
      {
        expiresIn: 86400, // 24 hours
      }
    );

    // 4. Respond with the token and user data
    res.status(200).send({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).send({ message: "Error during login." });
  }
};
