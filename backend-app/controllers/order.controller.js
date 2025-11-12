// backend-app/controllers/order.controller.js

const db = require("../models");
const Order = db.Order;
const Product = db.Product;
const User = db.User;
const { Op } = require("sequelize");
const { sequelize } = db; // Import the sequelize instance for transaction management

/**
 * 1. Creates a new order from cart data, managing stock and ensuring data integrity via a transaction.
 * This is a User-only endpoint.
 *
 * @param {object} req - Express request object. Expects userId (from JWT) and body with order details.
 * @param {object} req.body - Order details including totalAmount, shippingAddress, paymentMethod, and cartItems.
 * @param {Array<object>} req.body.cartItems - Array of items in the cart (must include id, name, and quantity).
 * @param {object} res - Express response object.
 * @returns {object} 201 response with success message and order ID, or 400/500 error.
 */

// 1. CREATE a new order from cart data (User Only)
exports.createOrder = async (req, res) => {
  // Note: The userId is extracted from the JWT token in the verifyToken middleware
  const userId = req.userId;
  const { totalAmount, shippingAddress, paymentMethod, cartItems } = req.body;

  // --- Start a database transaction to ensure atomicity and consistency ---
  // If any operation fails (e.g., stock check or decrement), the entire transaction is rolled back.
  const t = await sequelize.transaction();

  try {
    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return res.status(400).send({ message: "Cart is empty." });
    } // 1. Check stock availability for all items in one go

    for (const item of cartItems) {
      const product = await Product.findByPk(item.id, { transaction: t });
      if (!product || product.inStock < item.quantity) {
        await t.rollback();
        return res
          .status(400)
          .send({ message: `Insufficient stock for product: ${item.name}` });
      }
    }

    // 2. Create the main Order record
    const order = await Order.create(
      {
        userId: userId,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod, // Status is defaulted to 'Pending'
      },
      { transaction: t }
    );

    // 3. Update Product Stock: Loop through cart items and decrement the 'inStock' quantity.
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id, { transaction: t });
      await product.decrement("inStock", { by: item.quantity, transaction: t });
    }

    // 4. Commit the transaction if all stock checks and database writes succeeded
    await t.commit();

    res.status(201).send({
      message: "Order placed successfully!",
      orderId: order.id,
    });
  } catch (error) {
    // 5. Rollback the transaction if any step failed (including network or database errors)
    await t.rollback();
    console.error("Order Creation Error:", error);
    res.status(500).send({
      message: "Error processing order. Changes were not saved.",
      error: error.message,
    });
  }
};

/**
 * 2. Retrieves all orders placed by the currently authenticated user.
 * This is a User-only endpoint for viewing order history.
 *
 * @param {object} req - Express request object. Expects userId from JWT.
 * @param {object} res - Express response object.
 * @returns {object} 200 response with an array of user orders, or 404/500 error.
 */
exports.getUserOrders = async (req, res) => {
  // userId is attached to the request object by the verifyToken middleware
  const userId = req.userId;

  try {
    const orders = await Order.findAll({
      where: { userId: userId },
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .send({ message: "No orders found for this user." });
    }

    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).send({
      message: "Error retrieving order history.",
      error: error.message,
    });
  }
};

/**
 * 3. RETRIEVE ALL orders in the system.
 * This is an Admin-only endpoint for dashboard management.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} 200 response with an array of all orders, including user details, or 404/500 error.
 */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      // Include the associated User model to show who placed the order
      include: [{ model: db.User, attributes: ["id", "username", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .send({ message: "No orders found in the system." });
    }

    res.status(200).send(orders);
  } catch (error) {
    console.error("Error fetching all orders for admin:", error);
    res.status(500).send({
      message: "Error retrieving all orders.",
      error: error.message,
    });
  }
};

/**
 * 4. Updates the status of a specific order by ID.
 * This is an Admin-only endpoint.
 *
 * @param {object} req - Express request object. Expects orderId in params and new status in body.
 * @param {string} req.params.orderId - The ID of the order to update.
 * @param {string} req.body.status - The new status (must be 'Pending', 'Shipped', 'Delivered', or 'Cancelled').
 * @param {object} res - Express response object.
 * @returns {object} 200 response with confirmation and the updated order object, or 404/500 error.
 */
exports.updateOrderStatus = async (req, res) => {
  const { orderId } = req.params; // Get ID from URL parameter
  const { status } = req.body; // Get new status from request body // Optional: Basic validation to ensure status is one of the allowed values

  const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).send({ message: "Invalid status value provided." });
  }

  try {
    const [updatedRows] = await db.Order.update(
      { status: status },
      { where: { id: orderId } }
    );

    if (updatedRows === 0) {
      return res
        .status(404)
        .send({ message: `Order with ID ${orderId} not found.` });
    } // Fetch the updated order to send back confirmation

    const updatedOrder = await db.Order.findByPk(orderId, {
      // Include User for Admin view consistency
      include: [{ model: db.User, attributes: ["id", "username", "email"] }],
    });

    res.status(200).send({
      message: `Order #${orderId} status updated to ${status}.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).send({
      message: "Error processing order status update.",
      error: error.message,
    });
  }
};

/**
 * 5. Calculates key performance indicator (KPI) metrics for the Admin Dashboard.
 * This includes total sales, total orders, and total products.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {object} 200 response with totalSales, totalOrders, totalProducts, and latestOrderDate.
 */
exports.getKpiMetrics = async (req, res) => {
  try {
    // 1. Calculate Total Sales (Revenue)
    const totalSalesResult = await Order.findOne({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalSales"],
      ],
      raw: true,
    });
    const totalSales = parseFloat(totalSalesResult.totalSales || 0).toFixed(2);

    // 2. Count Total Orders
    const totalOrders = await Order.count();

    // 3. Count Total Products
    const totalProducts = await Product.count();

    // 4. (Optional) Latest Order Date (To show freshness of data)
    const latestOrder = await Order.findOne({
      attributes: ["createdAt"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    res.status(200).send({
      totalSales,
      totalOrders,
      totalProducts,
      latestOrderDate: latestOrder ? latestOrder.createdAt : null,
    });
  } catch (error) {
    console.error("KPI Error:", error);
    res.status(500).send({
      message: "Error fetching KPI data.",
      error: error.message,
    });
  }
};

// --- FINAL EXPORTS BLOCK ---
// Ensure all functions are correctly exported for use in routes
module.exports = {
  createOrder: exports.createOrder,
  getUserOrders: exports.getUserOrders,
  getAllOrders: exports.getAllOrders,
  updateOrderStatus: exports.updateOrderStatus,
  getKpiMetrics: exports.getKpiMetrics,
};
