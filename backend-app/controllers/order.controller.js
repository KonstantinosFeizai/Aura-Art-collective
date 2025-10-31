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
  const { totalAmount, shippingAddress, paymentMethod, cartItems } = req.body;

  // --- Start a database transaction ---
  // Transactions ensure that all database operations (creating the order,
  // updating stock) succeed or fail together.
  const t = await sequelize.transaction();

  try {
    if (!cartItems || cartItems.length === 0) {
      await t.rollback();
      return res.status(400).send({ message: "Cart is empty." });
    }

    // 1. Check stock availability for all items in one go
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
        paymentMethod: paymentMethod,
        // Status is defaulted to 'Pending'
      },
      { transaction: t }
    );

    // 3. Loop through cart items and update the Product stock
    for (const item of cartItems) {
      const product = await Product.findByPk(item.id, { transaction: t });

      // The logic here is simplified. In a real application, you'd create a separate
      // OrderItem table to link products to the order. For this project scope,
      // we focus on just updating the stock after order creation.

      await product.decrement("inStock", { by: item.quantity, transaction: t });
    }

    // 4. Commit the transaction if all steps succeeded
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

// 2. RETRIEVE all orders for the authenticated user
exports.getUserOrders = async (req, res) => {
  // userId is attached to the request object by the verifyToken middleware
  const userId = req.userId;

  try {
    const orders = await Order.findAll({
      where: { userId: userId },
      // Sort by creation date, newest first
      order: [["createdAt", "DESC"]],
      // Optionally, include other related models here (e.g., OrderItems if implemented)
      // For now, we return only the Order record itself
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
