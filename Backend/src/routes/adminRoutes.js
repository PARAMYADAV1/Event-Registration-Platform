
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "event_system_secret_change_this";

// Admin login
router.post("/login", (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query("SELECT * FROM admins WHERE email = ?", [email], async (err, result) => {
        if (err) return res.status(500).json({ message: err.message });

        if (!result.length) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const admin = result[0];
        const validPassword = await bcrypt.compare(password, admin.password);

        if (!validPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: "admin" },
            JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Admin login successful",
            token,
            admin: {
                id: admin.id,
                name: admin.name,
                email: admin.email
            }
        });
    });
});

module.exports = router;
