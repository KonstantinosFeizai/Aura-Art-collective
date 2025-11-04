const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt"); // Import token middleware

// POST /api/orders - Submit a new order (Requires user to be logged in)
router.post("/", [verifyToken], orderController.createOrder);

// GET /api/orders - Retrieve all orders for the logged-in user (Requires user to be logged in)
router.get("/", [verifyToken], orderController.getUserOrders);

// PUT /api/orders/:orderId - Update order status (Admin Only)
router.put(
  "/:orderId",
  [verifyToken, isAdmin],
  orderController.updateOrderStatus
);

// GET /api/admin/orders/all - Retrieve all orders (Admin Only)
router.get("/all", [verifyToken, isAdmin], orderController.getAllOrders);

// KPI Route removed from here! It must be placed in admin.routes.js.

module.exports = router;
