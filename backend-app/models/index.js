// backend-app/models/index.js

const { Sequelize, DataTypes } = require("sequelize"); // Import Sequelize and DataTypes modules
require("dotenv").config(); // Load environment variables

/**
 * @fileoverview Main configuration file for Sequelize, handling database connection,
 * model importing, and defining all inter-model associations (relationships).
 */

// --- 1. Database Connection Initialization ---
const sequelize = new Sequelize(
  process.env.DB_NAME, // Database name
  process.env.DB_USER, // Database username
  process.env.DB_PASS, // Database password
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // specify the SQL dialect type
    logging: false, // Set to console.log to see SQL queries
  }
);

// Database object to hold Sequelize instances and models
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- 2. Import Models ---
// Import all model definitions, passing the initialized sequelize instance and DataTypes
db.User = require("./User")(sequelize, DataTypes);
db.Product = require("./Product")(sequelize, DataTypes);
db.CartItem = require("./CartItem")(sequelize, DataTypes);
db.Order = require("./Order")(sequelize, DataTypes);
db.ContactMessage = require("./ContactMessage")(sequelize, DataTypes);

// --- 3. Define Associations (Relationships) ---

// 3.1. User <-> CartItem (One-to-Many: A User has multiple items in their cart)
db.User.hasMany(db.CartItem, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.CartItem.belongsTo(db.User, { foreignKey: "userId" });

// 3.2. User <-> Order (One-to-Many: A User can place multiple Orders)
db.User.hasMany(db.Order, {
  foreignKey: "userId",
  onDelete: "SET NULL",
});
db.Order.belongsTo(db.User, { foreignKey: "userId" });

// 3.3. Product <-> CartItem (One-to-Many: A Product can be in multiple cart records)
db.Product.hasMany(db.CartItem, {
  foreignKey: "productId",
});
db.CartItem.belongsTo(db.Product, { foreignKey: "productId" });

// --- 4. Synchronize Database (Creates/Updates all tables) ---
// Note: In production, consider using migrations instead of `sync({ alter: true })`
db.sequelize
  .sync({ alter: true }) // 'alter: true' tries to safely apply changes without dropping data
  .then(() => {
    console.log("Database & tables synced! (All tables created/updated)");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = db;
