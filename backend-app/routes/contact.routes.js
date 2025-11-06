// backend-app/routes/contact.routes.js (UPDATED to export the router)

const express = require("express");
const router = express.Router(); // Create the router
const contactController = require("../controllers/contact.controller.js");

// PUBLIC ROUTE: POST /api/contact
// The base path (/) here corresponds to /api/contact in server.js
router.post("/", contactController.createMessage);

// Export the router object
module.exports = router;
