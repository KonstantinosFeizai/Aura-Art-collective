// frontend-app/src/services/product.service.js

import axios from 'axios';

const API_URL = "http://localhost:3001/api/products/";

class ProductService {
    // Helper to get the JWT from local storage
    _getAuthHeader() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.accessToken) {
            return { Authorization: 'Bearer ' + user.accessToken };
        } else {
            return {};
        }
    }

    // --- Public: Fetch all products (for the Shop page) ---
    async getAllProducts() {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    // --- Public: Fetch a single product by ID (for the detail page) ---
    async getProduct(id) {
        try {
            const response = await axios.get(API_URL + id);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    }

    // --- Admin: Create a new product (Requires token) ---
    async createProduct(productData) {
        try {
            const response = await axios.post(
                API_URL, 
                productData, 
                { headers: this._getAuthHeader() } // Send token in header
            );
            return response.data;
        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    // --- Admin: Update a product by ID (Requires token) ---
    async deleteProduct(id) {
        try {
            const response = await axios.delete(
                API_URL + id,
                { headers: this._getAuthHeader() } // Send token in header
            );
            return response.data;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            // Throw a custom error message to be displayed in the UI
            throw new Error(error.response?.data?.message || `Failed to delete product ${id}. Access denied or server error.`);
        }
    }

    // --- Admin: Update a product by ID (Requires token) ---
    async updateProduct(id, productData) {
        try {
            const response = await axios.put(
                API_URL + id, 
                productData, 
                { headers: this._getAuthHeader() } // Send token in header
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw new Error(error.response?.data?.message || `Failed to update product ${id}.`);
        }
    }
   
}

export default new ProductService();