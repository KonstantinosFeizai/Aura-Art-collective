/** //backend-app/controllers/contact.controller.js
 * Contact Controller
 *
 * Responsible for creating, listing (paginated) and deleting contact messages.
 * Functions in this controller are intended to be used by route handlers.
 *
 * Notes:
 * - createMessage: public endpoint used by site visitors.
 * - getAllMessages / deleteMessage: intended for admin usage (authorization should
 *   be enforced at the route/middleware level).
 *
 * Uses Sequelize model: ContactMessage
 */

const db = require("../models");
const ContactMessage = db.ContactMessage;
const { Op } = require("sequelize");

/**
 * Create and save a new ContactMessage
 *
 * Expected request body:
 *  - name {string}    : sender's name (required)
 *  - email {string}   : sender's email (required)
 *  - subject {string} : message subject (required)
 *  - message {string} : message body (required)
 *
 * Response:
 *  - 201 : { message: "Message sent successfully!", data: <createdRecord> }
 *  - 400 : { message: "All fields are required!" } when validation fails
 *  - 500 : server error
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.createMessage = async (req, res) => {
  // Basic validation: all fields required
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

    // Return created message (including auto fields like id, createdAt)
    res.status(201).send({ message: "Message sent successfully!", data });
  } catch (err) {
    // Generic error response; the caller can log specifics server-side
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the ContactMessage.",
    });
  }
};

/**
 * Retrieve all ContactMessages (paginated)
 *
 * Query params:
 *  - page {number}  : page number (defaults to 1)
 *  - limit {number} : items per page (defaults to 10)
 *
 * Response:
 *  - 200 : {
 *      messages: Array<ContactMessage>,
 *      totalMessages: number,
 *      totalPages: number,
 *      currentPage: number
 *    }
 *  - 500 : server error
 *
 * Important:
 *  - This function returns rows sorted by createdAt DESC (newest first).
 *  - Authorization (admin-only) should be enforced by route middleware.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.getAllMessages = async (req, res) => {
  // Parse pagination query parameters with safe defaults
  const page = parseInt(req.query.page, 10) || 1;
  const limit = Math.max(1, parseInt(req.query.limit, 10) || 10);
  const offset = (page - 1) * limit;

  try {
    const data = await ContactMessage.findAndCountAll({
      limit: limit,
      offset: offset,
      order: [["createdAt", "DESC"]], // newest messages first
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

/**
 * Delete a ContactMessage by ID
 *
 * Route param:
 *  - id {number|string} : ID of the message to delete
 *
 * Response:
 *  - 200 : { message: "Contact message was deleted successfully!" } when deleted
 *  - 404 : { message: `Cannot delete ContactMessage with id=${id}. Maybe ContactMessage was not found!` }
 *  - 500 : server error
 *
 * Important:
 *  - This endpoint should be protected by admin-only middleware at the route level.
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
exports.deleteMessage = async (req, res) => {
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
