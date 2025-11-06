// backend-app/server.js

// Load environment variables from .env file (must be first!)
require("dotenv").config();

// Core dependencies
const express = require("express");
const cors = require("cors");

// Database initialization (Sequelize connection and model syncing)
const db = require("./models");

const app = express();

// --- Middleware Setup ---
app.use(cors());
app.use(express.json());

// --- Routes Setup ---
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const adminContactRoutes = require("./routes/admin.contact.routes");

// --- Mount Routes ---

// 1. Specific Admin Routes (Must be first to be found before the general /api/admin)
app.use("/api/admin/contact", adminContactRoutes); // <-- Moved up!

// 2. General Admin Routes
app.use("/api/admin", adminRoutes);

// 3. Other Public/Standard Routes
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// 4. Public Contact Route (Must be here to handle the POST)
app.use("/api/contact", contactRoutes);

// --- Start Server Function ---
async function startServer() {
  try {
    // 1. Authenticate (Test) the connection
    await db.sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // 2. Synchronize models with the database
    // This will create/update tables (including ContactMessages)
    await db.sequelize.sync({ alter: true });
    console.log("✅ All models synchronized with database. Tables are ready."); // 3. Start the Express server

    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`Open http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(
      "🛑 Unable to connect to the database or start server:",
      error
    );
  }
}

// Simple test route
app.get("/", (req, res) => {
  res.send("Aura Art Collective API is running!");
});

// Execute the function to connect and start
startServer();
