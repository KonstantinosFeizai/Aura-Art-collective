// backend-app/routes/admin.contact.routes.js:{Update Admin Contact Routes}:backend-app/routes/admin.contact.routes.js
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contact.controller.js");
const { verifyToken, isAdmin } = require("../middleware/authJwt");

// Middleware to apply to all routes in this file
router.use(verifyToken);
router.use(isAdmin);

// GET /api/admin/contact/messages - Get all contact messages (paginated)
router.get("/messages", contactController.getAllMessages);

// DELETE /api/admin/contact/messages/:id - Delete a specific contact message
router.delete("/messages/:id", contactController.deleteMessage); // <-- NEW ROUTE

module.exports = router;
