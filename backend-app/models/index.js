// backend-app/models/index.js
const { Sequelize, DataTypes } = require("sequelize");

require("dotenv").config();

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // Set to console.log to see SQL queries
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- Import Models ---
db.User = require("./User")(sequelize, DataTypes);
db.Product = require("./Product")(sequelize, DataTypes);
db.CartItem = require("./CartItem")(sequelize, DataTypes);
db.Order = require("./Order")(sequelize, DataTypes);
db.ContactMessage = require("./ContactMessage")(sequelize, DataTypes);

// --- Define Associations (Relationships) ---
// 1. A User can have many CartItems
db.User.hasMany(db.CartItem, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
db.CartItem.belongsTo(db.User, { foreignKey: "userId" });

// 2. A User can have many Orders
db.User.hasMany(db.Order, {
  foreignKey: "userId",
  onDelete: "SET NULL",
});
db.Order.belongsTo(db.User, { foreignKey: "userId" });

// 3. A Product can be in many CartItems
db.Product.hasMany(db.CartItem, {
  foreignKey: "productId",
});
db.CartItem.belongsTo(db.Product, { foreignKey: "productId" });

// --- Synchronize Database (Creates/Updates all tables) ---
// This command checks all loaded models (including ContactMessage) and creates/alters tables.
db.sequelize
  .sync({ alter: true }) // 'alter: true' tries to safely apply changes without dropping data
  .then(() => {
    console.log("Database & tables synced! (All tables created/updated)");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = db;
