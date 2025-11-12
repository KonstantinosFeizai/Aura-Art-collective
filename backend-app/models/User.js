// backend-app/models/User.js

const { DataTypes } = require("sequelize");
/**
 * Defines the User model for Sequelize.
 * This model stores user account credentials and profile information.
 * Note: Password should be hashed before saving to the database.
 *
 * @param {object} sequelize - The Sequelize connection instance.
 * @param {object} DataTypes - Object containing Sequelize data types.
 * @returns {object} The Sequelize User Model.
 */

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      // Primary Key: Unique identifier for the user
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      // Basic user information
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique_username", // Named unique constraint
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: "unique_email", // Named unique constraint
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Role for authentication (Crucial for Admin vs. Standard User)
      role: {
        type: DataTypes.ENUM("standard", "admin"),
        defaultValue: "standard",
        allowNull: false,
      },
      // Optional profile details
      firstName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      // Optional: Ensure model name is 'User' and table name is 'Users'
      tableName: "Users",
      timestamps: true, // Adds createdAt and updatedAt columns
      indexes: [], // Remove any additional index definitions
    }
  );

  return User;
};
