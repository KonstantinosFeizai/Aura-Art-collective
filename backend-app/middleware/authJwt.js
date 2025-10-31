// backend-app/middleware/authJwt.js

const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.User;

// Middleware 1: Checks if a valid JWT is present in the request header
exports.verifyToken = (req, res, next) => {
    // Check for token in the Authorization header (e.g., "Bearer eyJhbGciOi...")
    let token = req.headers['x-access-token'] || req.headers['authorization'];

    if (!token) {
        return res.status(403).send({
            message: "No token provided! Access denied."
        });
    }

    // Standard practice is to send token as "Bearer <token>", so we remove "Bearer "
    if (token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }
    
    // Verify the token's authenticity and expiration
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized! Invalid or expired token."
            });
        }
        // If valid, save the user ID and role to the request object for later use
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next(); // Proceed to the next middleware or controller function
    });
};

// Middleware 2: Checks if the verified user has the 'admin' role
exports.isAdmin = (req, res, next) => {
    // This assumes verifyToken has already run and populated req.userRole
    if (req.userRole === 'admin') {
        next(); // User is an admin, proceed
        return;
    }

    res.status(403).send({
        message: "Require Admin Role! Access forbidden."
    });
};