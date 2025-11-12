// backend-app/middleware/authJwt.js

const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

/**
 * Middleware 1: Verifies the authenticity and validity of the JSON Web Token (JWT).
 * If valid, it attaches the user's ID and role to the request object.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() if token is valid, otherwise sends a 401 or 403 response.
 */
exports.verifyToken = (req, res, next) => {
  // Check for the token in two common locations:
  // 1. 'x-access-token' (custom header)
  // 2. 'authorization' (standard header, usually "Bearer <token>")
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res.status(403).send({
      message: "No authentication token provided! Access denied.",
    });
  }

  // If token is sent in the standard 'Bearer' format, strip the prefix.
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  // Verify the token's authenticity against the secret and check for expiration
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Handle errors like token expiration (TokenExpiredError) or invalid signature (JsonWebTokenError)
      console.error("JWT Verification Error:", err.message);
      return res.status(401).send({
        message: "Unauthorized! Invalid or expired token.",
        error: err.name, // Provide the type of JWT error for debugging
      });
    }

    // If the token is valid, attach the payload data (user ID and role) to the request
    // This makes user context available to all subsequent controllers.
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next(); // Proceed to the next middleware or controller function
  });
};

/**
 * Middleware 2: Ensures the authenticated user has the 'admin' role.
 * This should be used after verifyToken.
 *
 * @param {object} req - Express request object. Assumes req.userRole is populated.
 * @param {object} res - Express response object.
 * @param {function} next - Express next middleware function.
 * @returns {void} Calls next() if user is admin, otherwise sends a 403 response.
 */
exports.isAdmin = (req, res, next) => {
  // This check relies on the req.userRole being set by the preceding verifyToken middleware.
  if (req.userRole === "admin") {
    next(); // User has the required role, grant access
    return;
  }

  // If the role is not 'admin' or is undefined (shouldn't happen if verifyToken ran), deny access.
  res.status(403).send({
    message: "Require Admin Role! Access forbidden for non-admin users.",
  });
};

// Export all middleware functions in a single module object
module.exports = {
  verifyToken: exports.verifyToken,
  isAdmin: exports.isAdmin,
};
