// backend-app/models/Order.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Order = sequelize.define('Order', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        totalAmount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
            defaultValue: 'Pending',
            allowNull: false
        },
        shippingAddress: {
            type: DataTypes.STRING,
            allowNull: false
        },
        paymentMethod: {
            type: DataTypes.STRING,
            allowNull: false // Will be set during checkout (e.g., 'Credit Card', 'PayPal')
        }
        // Foreign key (userId) will be added automatically below
    }, {
        tableName: 'Orders',
        timestamps: true 
    });

    return Order;
};