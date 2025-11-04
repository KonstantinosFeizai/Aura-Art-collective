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

app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

// --- Start Server Function ---
async function startServer() {
  try {
    // 1. Authenticate (Test) the connection (already done in models/index.js now, but good to keep)
    await db.sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");

    // 2. Start the Express server
    const PORT = process.env.PORT || 3001;

    // Ensure models are synced before starting server (handled in models/index.js)

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
