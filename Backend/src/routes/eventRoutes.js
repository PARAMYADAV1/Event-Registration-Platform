const adminAuth = require("../middleware/adminAuth");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all events
router.get("/", (req, res) => {
  db.query("SELECT * FROM events ORDER BY event_date ASC", (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// Admin: View all registrations
router.get("/", (req, res) => {
  const sql = `
    SELECT
      r.id AS registration_id,
      u.name,
      u.email,
      e.title AS event_title,
      e.event_date,
      e.location,
      r.registration_date
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    JOIN events e ON r.event_id = e.id
    ORDER BY r.registration_date DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.json(result);
  });
});

// Get one event
router.get("/:id", (req, res) => {
  db.query("SELECT * FROM events WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.length) return res.status(404).json({ message: "Event not found" });
    res.json(result[0]);
  });
});

// Add event
// Add event
router.post("/", adminAuth, (req, res) => {
  const { title, description, event_date, location } = req.body || {};

  if (!title || !event_date || !location) {
    return res.status(400).json({ message: "Title, date and location are required" });
  }

  const sql = "INSERT INTO events (title, description, event_date, location) VALUES (?, ?, ?, ?)";

  db.query(sql, [title, description || "", event_date, location], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    res.status(201).json({ message: "Event added successfully", id: result.insertId });
  });
});

// Update event
// Update event
router.put("/:id", adminAuth, (req, res) => {
  const { title, description, event_date, location } = req.body || {};

  if (!title || !event_date || !location) {
    return res.status(400).json({ message: "Title, date and location are required" });
  }

  const sql = `
    UPDATE events
    SET title = ?, description = ?, event_date = ?, location = ?
    WHERE id = ?
  `;

  db.query(sql, [title, description || "", event_date, location, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!result.affectedRows) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully" });
  });
});

// Delete event
// Delete event
router.delete("/:id", adminAuth, (req, res) => {
  db.query("DELETE FROM events WHERE id = ?", [req.params.id], (err, result) => {
    if (err) {
      return res.status(400).json({
        message: "Cannot delete this event because it may have registrations."
      });
    }

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  });
});

module.exports = router;
