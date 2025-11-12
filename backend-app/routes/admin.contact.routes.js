/** backend-app/routes/admin.contact.routes.js
 * @fileoverview Admin Contact Message Routes.
 * Defines API routes for managing user contact messages.
 * These routes are restricted to administrative users.
 * All routes are prefixed with /api/admin/contact
 */
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller.js");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// =======================================================
// Middleware Application (Auth & Authorization)
// These middlewares apply sequentially to ALL routes defined below.
// =======================================================

// 1. Authentication Check: Ensures a valid JWT is present
router.use(verifyToken);
// 2. Authorization Check: Ensures the authenticated user has the 'admin' role
router.use(isAdmin);

// =======================================================
// Contact Message Administration Endpoints
// =======================================================

/**
 * GET /api/admin/contact/messages
 * Retrieves a paginated list of all contact messages submitted by users.
 * Access: Requires Admin role.
 */
router.get("/messages", contactController.getAllMessages);

/**
 * DELETE /api/admin/contact/messages/:id
 * Deletes a specific contact message by its primary key ID.
 * Access: Requires Admin role.
 */
router.delete("/messages/:id", contactController.deleteMessage);

module.exports = router;
