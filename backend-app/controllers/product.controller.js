// backend-app/controllers/product.controller.js

const db = require("../models");
const Product = db.Product;

// 1. CREATE a new product (Admin Only)
exports.create = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).send({
      message: "Product created successfully!",
      product,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating product.",
      error: error.message,
    });
  }
};

// 2. READ all products (Public Access - For Home/Catalog Page)
exports.findAll = async (req, res) => {
  try {
    // Option to filter by 'featured' for the homepage carousel
    const condition = req.query.featured ? { isFeatured: true } : null;

    const products = await Product.findAll({ where: condition });
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving products.",
    });
  }
};

// 3. READ a single product by ID (Public Access - For Product Detail Page)
exports.findOne = async (req, res) => {
  const id = req.params.id;
  try {
    const product = await Product.findByPk(id);

    if (product) {
      res.status(200).send(product);
    } else {
      res.status(404).send({ message: `Product with id=${id} not found.` });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error retrieving product with id=" + id,
    });
  }
};

// 4. UPDATE a product by ID (Admin Only)
exports.update = async (req, res) => {
  const id = req.params.id;
  try {
    const [numUpdated] = await Product.update(req.body, {
      where: { id: id },
    });

    if (numUpdated === 1) {
      res.send({ message: "Product updated successfully." });
    } else {
      res.status(404).send({
        message: `Cannot update Product with id=${id}. Maybe Product was not found or req.body is empty!`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Error updating Product with id=" + id,
    });
  }
};

// 5. DELETE a product by ID (Admin Only)
exports.delete = async (req, res) => {
  const id = req.params.id;
  try {
    const numDeleted = await Product.destroy({
      where: { id: id },
    });

    if (numDeleted === 1) {
      res.send({ message: "Product deleted successfully!" });
    } else {
      res.status(404).send({
        message: `Cannot delete Product with id=${id}. Maybe Product was not found.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Could not delete Product with id=" + id,
    });
  }
};
