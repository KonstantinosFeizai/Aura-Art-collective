// backend-app/models/ContactMessage.js

const { DataTypes } = require("sequelize");

/**
 * Defines the ContactMessage model for Sequelize.
 * This model stores messages submitted by users via a contact form, including
 * sender details and the message content.
 *
 * @param {object} sequelize - The Sequelize connection instance.
 * @param {object} DataTypes - Object containing Sequelize data types.
 * @returns {object} The Sequelize ContactMessage Model.
 */
module.exports = (sequelize, DataTypes) => {
  const ContactMessage = sequelize.define(
    "ContactMessage",
    {
      // Primary Key: Unique identifier for each contact message
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: "Primary key of the contact message",
      },
      // Name of the person submitting the form
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Full name of the sender",
        validate: {
          notEmpty: true, // Name cannot be an empty string
        },
      },
      // Email address of the sender
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Email address of the sender for follow-up",
        validate: {
          isEmail: true, // Must be a valid email format
        },
      },
      // Subject line of the message
      subject: {
        type: DataTypes.STRING(255), // Explicitly limits subject length to 255 characters
        allowNull: false,
        comment: "The subject line of the inquiry",
        validate: {
          notEmpty: true, // Subject cannot be empty
        },
      },
      // The main content of the message
      message: {
        type: DataTypes.TEXT, // Uses TEXT for potentially long message content
        allowNull: false,
        comment: "The full content of the message",
        validate: {
          notEmpty: true, // Message content cannot be empty
        },
      },
    },
    {
      // Model Options
      tableName: "ContactMessages", // Specifies the database table name
      timestamps: true, // Automatically adds 'createdAt' and 'updatedAt' columns
      comment: "Stores messages submitted through the website contact form",
    }
  );

  return ContactMessage;
};
