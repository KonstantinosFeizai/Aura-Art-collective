// backend-app/controllers/order.controller.js

const db = require("../models");
const Order = db.Order;
const Product = db.Product;
const User = db.User;
const { sequelize } = db; // Import the sequelize instance for transaction management

// 1. CREATE a new order from cart data (User Only)
exports.createOrder = async (req, res) => {
  // Note: The userId is extracted from the JWT token in the verifyToken middleware
  const userId = req.userId;
  const { totalAmount, shippingAddress, paymentMethod, cartItems } = req.body; // --- Start a database transaction ---

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
    } // 2. Create the main Order record

    const order = await Order.create(
      {
        userId: userId,
        totalAmount: totalAmount,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod, // Status is defaulted to 'Pending'
      },
      { transaction: t }
    ); // 3. Loop through cart items and update the Product stock

    for (const item of cartItems) {
      const product = await Product.findByPk(item.id, { transaction: t });
      await product.decrement("inStock", { by: item.quantity, transaction: t });
    } // 4. Commit the transaction if all steps succeeded

    await t.commit();

    res.status(201).send({
      message: "Order placed successfully!",
      orderId: order.id,
    });
  } catch (error) {
    // 5. Rollback the transaction if any step failed
    await t.rollback();
    console.error("Order Creation Error:", error);
    res.status(500).send({
      message: "Error processing order. Changes were not saved.",
      error: error.message,
    });
  }
};

// 2. RETRIEVE all orders for the authenticated user (User History)
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

// 3. RETRIEVE ALL orders (Admin Only) <-- NEW FUNCTION
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

// 4. UPDATE order status by ID (Admin Only)
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

// --- FINAL EXPORTS BLOCK ---
module.exports = {
  createOrder: exports.createOrder,
  getUserOrders: exports.getUserOrders,
  getAllOrders: exports.getAllOrders, // <-- CRUCIAL FIX
  updateOrderStatus: exports.updateOrderStatus, // <-- CRUCIAL FIX
};
