const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// All routes in this file require Admin authorization
router.use([verifyToken, isAdmin]);

// GET /api/admin/kpis - Retrieve key performance indicators (Admin Only)
router.get("/kpis", orderController.getKpiMetrics);

module.exports = router;
