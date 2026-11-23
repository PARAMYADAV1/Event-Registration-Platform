const adminAuth = require("../middleware/adminAuth");
const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Submit registration
router.post("/", (req, res) => {
    const { name, email, event_id } = req.body || {};

    if (!name || !email || !event_id) {
        return res.status(400).json({
            message: "Name, email and event_id are required"
        });
    }

    const userQuery = `
        INSERT INTO users (name, email)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        id = LAST_INSERT_ID(id), name = VALUES(name)
    `;

    db.query(userQuery, [name, email], (err, userResult) => {
        if (err) return res.status(500).json({ message: err.message });

        const userId = userResult.insertId;

        db.query(
            "INSERT INTO registrations (user_id, event_id) VALUES (?, ?)",
            [userId, event_id],
            (err, result) => {
                if (err) {
                    return res.status(400).json({ message: err.message });
                }

                res.status(201).json({
                    message: "Registration successful",
                    registrationId: result.insertId
                });
            }
        );
    });
});

// View user's registrations

// Admin: View all registrations
router.get("/", adminAuth, (req, res) => {
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
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.json(result);
    });
});


// Cancel registration
router.delete("/:id", (req, res) => {
    const { email } = req.body || {};

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    const sql = `
        DELETE r FROM registrations r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = ? AND u.email = ?
    `;

    db.query(sql, [req.params.id, email], (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (!result.affectedRows) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        res.json({ message: "Registration cancelled successfully" });
    });
});

module.exports = router;
