const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path'); // <--- NEW: Import path module
const app = express();

// Use the port assigned by the hosting service, or 5000 if running locally
const PORT = process.env.PORT || 5000; 

// Middleware
app.use(cors());
app.use(express.json());

// --- NEW: Serve Frontend Files ---
// This tells the server to look inside the 'public' folder for your HTML, CSS, and images
app.use(express.static('public')); 
// ---------------------------------

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

// NEW: Root Route
// When someone visits your website URL, send them the index.html file
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

// GET Route: View all messages
app.get('/api/messages', (req, res) => {
    const sql = `SELECT * FROM messages ORDER BY id DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }
        res.json(rows);
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});