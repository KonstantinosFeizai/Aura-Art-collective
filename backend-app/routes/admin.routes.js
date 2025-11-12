/** backend-app/routes/admin.routes.js
 * @fileoverview Primary Admin API Routes.
 * Defines general administrative endpoints, typically related to business
 * intelligence, monitoring, or overall system health.
 * All routes defined here require both authentication and Admin authorization.
 * All routes are prefixed with /api/admin
 */
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// =======================================================
// Middleware Application (Auth & Authorization)
// These middlewares apply sequentially to ALL routes defined below.
// =======================================================

/**
 * Middleware: All routes in this file require:
 * 1. verifyToken: A valid JWT token.
 * 2. isAdmin: The authenticated user must have the 'admin' role.
 */
router.use([verifyToken, isAdmin]);

// =======================================================
// Business Intelligence Endpoints
// =======================================================

/**
 * GET /api/admin/kpis
 * Retrieves key performance indicators (KPIs) and aggregated business metrics
 * for administrative review (e.g., total sales, user count, best-selling items).
 * Access: Requires Admin role.
 */
router.get("/kpis", orderController.getKpiMetrics);

module.exports = router;
