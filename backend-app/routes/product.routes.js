/** backend-app/routes/product.routes.js
 * @fileoverview Product API Routes.
 * Defines the endpoints for managing product catalog data, with both public read access
 * and authenticated admin write access.
 * All routes defined here are prefixed with /api/products.
 */
const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
// Import authentication and authorization middleware
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// =======================================================
// PUBLIC ROUTES (No authentication or role check required)
// =======================================================

/**
 * GET /api/products
 * Retrieves a list of all products (e.g., for the main catalog page).
 * Access: PUBLIC (Available to all users, logged in or not).
 */
router.get("/", productController.findAll);

/**
 * GET /api/products/:id
 * Retrieves the details of a single product by its ID.
 * Access: PUBLIC (Available to all users, logged in or not).
 */
router.get("/:id", productController.findOne);

// =======================================================
// ADMIN ROUTES (Requires valid token AND 'admin' role)
// =======================================================

/**
 * POST /api/products
 * Creates a new product in the catalog.
 * Middleware: [verifyToken, isAdmin] - Requires an authenticated user with the 'admin' role.
 */
router.post("/", [verifyToken, isAdmin], productController.create);

/**
 * PUT /api/products/:id
 * Updates an existing product identified by its ID.
 * Middleware: [verifyToken, isAdmin] - Requires an authenticated user with the 'admin' role.
 */
router.put("/:id", [verifyToken, isAdmin], productController.update);

/**
 * DELETE /api/products/:id
 * Removes a product from the catalog.
 * Middleware: [verifyToken, isAdmin] - Requires an authenticated user with the 'admin' role.
 */
router.delete("/:id", [verifyToken, isAdmin], productController.delete);

// Export the router object
module.exports = router;
