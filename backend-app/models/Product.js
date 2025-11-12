// backend-app/models/Product.js

const { DataTypes } = require("sequelize");
/**
 * Defines the Product model for Sequelize.
 * This model stores all necessary details for items available for sale in the shop.
 *
 * @param {object} sequelize - The Sequelize connection instance.
 * @param {object} DataTypes - Object containing Sequelize data types.
 * @returns {object} The Sequelize Product Model.
 */
module.exports = (sequelize) => {
  const Product = sequelize.define(
    "Product",
    {
      // Primary Key: Unique identifier for the product
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT, // Use TEXT for long descriptions
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2), // Price up to 10 digits, 2 decimal places
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING, // e.g., 'Paintings', 'Sculpture', 'Prints'
        allowNull: true,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true, // URL to the image (e.g., hosted on AWS S3 or similar)
      },
      inStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "Products",
      timestamps: true,
    }
  );

  return Product;
};
