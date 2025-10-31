// backend-app/models/CartItem.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const CartItem = sequelize.define('CartItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
        // Foreign keys (userId and productId) will be added automatically below
    }, {
        tableName: 'CartItems',
        timestamps: true 
    });

    return CartItem;
};