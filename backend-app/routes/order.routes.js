// backend-app/routes/order.routes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken } = require("../middleware/authJwt"); // Import token middleware

// POST /api/orders - Submit a new order (Requires user to be logged in)
router.post("/", [verifyToken], orderController.createOrder);

// GET /api/orders - Retrieve all orders for the logged-in user (Requires user to be logged in)
router.get("/", [verifyToken], orderController.getUserOrders); // <-- NEW ROUTE

module.exports = router;
