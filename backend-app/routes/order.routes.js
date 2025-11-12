/** backend-app/routes/order.routes.js
 * @fileoverview Order API Routes.
 * Defines the endpoints for creating, retrieving, and updating customer orders.
 * These routes utilize both standard authentication (verifyToken) and authorization (isAdmin).
 * All routes defined here are prefixed with /api/orders.
 */
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
// Import token verification and authorization middleware
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// =======================================================
// User-Specific Endpoints (Requires Authentication)
// =======================================================

/**
 * POST /api/orders
 * Creates and submits a new order based on the user's current state (e.g., shopping cart).
 * Middleware: [verifyToken] - Ensures the user is logged in before creating the order.
 */
router.post("/", [verifyToken], orderController.createOrder);

/**
 * GET /api/orders
 * Retrieves all orders belonging ONLY to the currently logged-in user.
 * Middleware: [verifyToken] - Ensures the user is logged in to view their order history.
 */
router.get("/", [verifyToken], orderController.getUserOrders);

// =======================================================
// Admin Endpoints (Requires Authorization)
// =======================================================

/**
 * PUT /api/orders/:orderId
 * Updates the status of a specific order (e.g., confirming shipment, canceling).
 * Middleware: [verifyToken, isAdmin] - Only authenticated administrators can modify order status.
 */
router.put(
  "/:orderId",
  [verifyToken, isAdmin],
  orderController.updateOrderStatus
);

/**
 * GET /api/orders/all
 * Retrieves a list of ALL orders across the entire application (global administrative view).
 * Middleware: [verifyToken, isAdmin] - Only authenticated administrators can view all orders.
 */
router.get("/all", [verifyToken, isAdmin], orderController.getAllOrders);

// Export the router object
module.exports = router;
