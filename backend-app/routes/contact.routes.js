/** backend-app/routes/contact.routes.js
 * @fileoverview Contact Message API Routes.
 * Defines the public endpoint for users to submit contact/feedback messages.
 * This route is intended to be PUBLICLY accessible and does NOT require authentication.
 * All routes defined here are prefixed with /api/contact.
 */
const express = require("express");
const router = express.Router(); // Create the router
const contactController = require("../controllers/contact.controller.js");

// =======================================================
// Public Contact Endpoint
// =======================================================

/**
 * POST /api/contact
 * The base path (/) here corresponds to /api/contact.
 * This route allows anonymous users to submit a new message to the system (e.g., from a "Contact Us" form).
 * The controller handles validation and saving the message to the database.
 */
router.post("/", contactController.createMessage);

// Export the router object so it can be mounted in the main application file (server.js/app.js)
module.exports = router;
