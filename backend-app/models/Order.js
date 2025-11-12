// backend-app/models/Order.js

const { DataTypes } = require("sequelize");
/**
 * Defines the Order model for Sequelize.
 * This model stores information about a completed user order, including
 * total cost, status, and shipping details.
 *
 * @param {object} sequelize - The Sequelize connection instance.
 * @param {object} DataTypes - Object containing Sequelize data types (imported by index.js).
 * @returns {object} The Sequelize Order Model.
 */
module.exports = (sequelize) => {
  const Order = sequelize.define(
    "Order",
    {
      // Primary Key: Unique identifier for the order
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // The final calculated total amount for the order
      totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      // Current status of the order, defined by a restricted list of values
      status: {
        type: DataTypes.ENUM(
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled"
        ),
        defaultValue: "Pending",
        allowNull: false,
      },
      shippingAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false, // Will be set during checkout (e.g., 'Credit Card', 'PayPal')
      },
      // The foreign key 'userId' is automatically added by the association defined in index.js
    },
    {
      tableName: "Orders",
      timestamps: true,
    }
  );

  return Order;
};
