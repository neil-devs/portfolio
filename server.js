const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();

// Use the port assigned by the hosting service, or 5000 if running locally
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());

// Serve Frontend Files
// This tells the server to look inside the 'public' folder for your HTML, CSS, and images
app.use(express.static('public')); 

// 1. Connect/Create the SQLite Database
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error('❌ Database Error:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
    }
});

// 2. Create the 'messages' table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    date TEXT
)`);

// --- Routes ---

// Root Route: Serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST Route: Save a new message
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const date = new Date().toISOString();

    // SQL Query to insert data
    const sql = `INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)`;
    
    db.run(sql, [name, email, message, date], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'Message saved!', id: this.lastID });
    });
});

// GET Route: View all messages (SECURE VERSION)
// This route now requires a password to view the data
app.get('/api/messages', (req, res) => {
    // 1. Check the password sent from the browser
    const password = req.query.password;

    // 2. CHANGE THIS to the same password you put in admin.html
    const MY_SECRET_PASSWORD = "neil-secret-code"; 

    if (password !== MY_SECRET_PASSWORD) {
        // If password is wrong, block them instantly
        return res.status(403).json({ success: false, message: "⛔ Access Denied: Wrong Password" });
    }

    // 3. If password matches, show the data
    const sql = `SELECT * FROM messages ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});