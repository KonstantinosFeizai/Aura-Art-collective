// backend-app/controllers/contact.controller.js:{Update Contact Controller with Delete}:backend-app/controllers/contact.controller.js
const db = require("../models");
const ContactMessage = db.ContactMessage;
const { Op } = require("sequelize");

// Create and Save a new ContactMessage
exports.createMessage = async (req, res) => {
  // Validate request
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.subject ||
    !req.body.message
  ) {
    return res.status(400).send({ message: "All fields are required!" });
  }

  const message = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  };

  try {
    const data = await ContactMessage.create(message);
    res.status(201).send({ message: "Message sent successfully!", data });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ContactMessage.",
    });
  }
};

// Retrieve all ContactMessages (Admin Only - Paginated)
exports.getAllMessages = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const data = await ContactMessage.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]], // Sort by newest first
    });

    const totalPages = Math.ceil(data.count / limit);

    res.status(200).send({
      messages: data.rows,
      totalMessages: data.count,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving contact messages.",
    });
  }
};

// Delete a ContactMessage by ID (Admin Only)
exports.deleteMessage = async (req, res) => {
  // <-- NEW FUNCTION
  const id = req.params.id;

  try {
    const num = await ContactMessage.destroy({
      where: { id: id },
    });

    if (num === 1) {
      res.status(200).send({
        message: "Contact message was deleted successfully!",
      });
    } else {
      res.status(404).send({
        message: `Cannot delete ContactMessage with id=${id}. Maybe ContactMessage was not found!`,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete ContactMessage with id=" + id,
    });
  }
};
