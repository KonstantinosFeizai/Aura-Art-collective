// backend-app/models/index.js (COMPLETE VERSION)

const { Sequelize } = require('sequelize');

require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// --- Import Models ---
db.User = require('./User')(sequelize);
db.Product = require('./Product')(sequelize);
db.CartItem = require('./CartItem')(sequelize); // <-- NEW
db.Order = require('./Order')(sequelize);       // <-- NEW

// --- Define Associations (Relationships) ---
// 1. A User can have many CartItems
db.User.hasMany(db.CartItem, {
    foreignKey: 'userId', // Adds userId column to CartItems table
    onDelete: 'CASCADE'   // Delete cart items if user is deleted
});
db.CartItem.belongsTo(db.User, { foreignKey: 'userId' });

// 2. A User can have many Orders
db.User.hasMany(db.Order, {
    foreignKey: 'userId', // Adds userId column to Orders table
    onDelete: 'SET NULL' // Keep order history but set userId to NULL if user is deleted
});
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

// 3. A Product can be in many CartItems
db.Product.hasMany(db.CartItem, {
    foreignKey: 'productId' // Adds productId column to CartItems table
});
db.CartItem.belongsTo(db.Product, { foreignKey: 'productId' });

// 4. Products in Orders (Many-to-Many through OrderItem junction table - for simplicity, we'll use a direct relationship here)
// Note: For a real e-commerce store, you'd usually create a separate OrderItem model.
// For now, we'll keep the Product reference simple, focusing on the main Order table. 
// We will come back to OrderItem later if needed for full history.

// --- Synchronize Database (Creates/Updates all tables) ---
db.sequelize.sync({ alter: true })
    .then(() => {
        console.log("Database & tables synced! (All tables created/updated)");
    })
    .catch(err => {
        console.error("Error syncing database:", err);
    });


module.exports = db;