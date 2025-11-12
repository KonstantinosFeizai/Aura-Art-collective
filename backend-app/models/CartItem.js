// backend-app/models/CartItem.js

const { DataTypes } = require("sequelize");

/**
 * Defines the CartItem model for Sequelize.
 * This model serves as the junction table for the M:N relationship between
 * User and Product, tracking what products (and how many) are in a user's shopping cart.
 *
 * @param {object} sequelize - The Sequelize connection instance.
 * @returns {object} The Sequelize CartItem Model.
 */
module.exports = (sequelize) => {
  const CartItem = sequelize.define(
    "CartItem",
    {
      // Primary Key: Unique identifier for the cart item record itself
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Primary key for the cart item record",
      },
      // The quantity of the associated Product in the User's cart
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        comment: "The quantity of the product currently in the cart",
      },
      // Foreign keys (userId and productId) will be defined and added automatically
      // when associations (e.g., CartItem.belongsTo(User), CartItem.belongsTo(Product))
      // are set up in the main models/index.js file.
    },
    {
      // Model Options
      tableName: "CartItems", // Explicitly set the table name
      timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' columns
      comment:
        "Stores products and quantities currently in a users shopping cart",
    }
  );

  return CartItem;
};
