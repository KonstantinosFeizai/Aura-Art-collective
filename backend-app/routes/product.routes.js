// backend-app/routes/product.routes.js

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken, isAdmin } = require('../middleware/authJwt'); // Import middleware

// --- PUBLIC ROUTES (No authentication required) ---
// GET /api/products
router.get('/', productController.findAll); 
// GET /api/products/:id
router.get('/:id', productController.findOne); 

// --- ADMIN ROUTES (Require valid token AND admin role) ---
// POST /api/products
router.post('/', [verifyToken, isAdmin], productController.create); 
// PUT /api/products/:id
router.put('/:id', [verifyToken, isAdmin], productController.update);
// DELETE /api/products/:id
router.delete('/:id', [verifyToken, isAdmin], productController.delete); 

module.exports = router;