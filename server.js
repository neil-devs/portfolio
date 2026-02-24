const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Hardcoded admin credentials for simplicity 
// IN PRODUCTION, USE ENVIRONMENT VARIABLES
const ADMIN_EMAIL = 'admin@neil.dev';
// Password is 'neil-secret-code'
const ADMIN_PASSWORD_HASH = '$2b$10$KvhC4cPwPdwgohVWA/whR.2uBy.8Su3BoC8Xz81gZ80MEu71GGgZ2';
const JWT_SECRET = 'super-secret-key-12345'; // Replace with a strong random secret in production

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- Database Setup ---
const db = new sqlite3.Database('./portfolio.db', (err) => {
    if (err) {
        console.error('❌ Database Error:', err.message);
    } else {
        console.log('✅ Connected to the SQLite database.');
        initDb();
    }
});

function initDb() {
    // Existing messages table
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT,
        date TEXT
    )`);

    // Projects table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        category TEXT,
        image_url TEXT,
        description TEXT,
        tech_stack TEXT,
        live_link TEXT,
        github_link TEXT
    )`);

    // Posts table (for the blog section)
    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT,
        date TEXT
    )`);
}

// --- Verification Middleware ---
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ success: false, message: 'Unauthorized' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Forbidden' });
        req.user = user;
        next();
    });
}

// --- Routes ---

// Root 
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// --- Auth Routes ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (email !== ADMIN_EMAIL) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
});


// --- Messages Routes ---
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const date = new Date().toISOString();
    db.run(`INSERT INTO messages (name, email, message, date) VALUES (?, ?, ?, ?)`,
        [name, email, message, date], function (err) {
            if (err) return res.status(500).json({ success: false, message: 'DB Error' });
            res.json({ success: true, message: 'Message saved!' });
        });
});

app.get('/api/messages', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM messages ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(rows);
    });
});

// --- Projects Routes ---
app.get('/api/projects', (req, res) => {
    db.all(`SELECT * FROM projects ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(rows);
    });
});

app.post('/api/projects', authenticateToken, (req, res) => {
    const { title, category, image_url, description, tech_stack, live_link, github_link } = req.body;
    db.run(`INSERT INTO projects (title, category, image_url, description, tech_stack, live_link, github_link) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [title, category, image_url, description, tech_stack, live_link, github_link], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Project added!' });
        });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM projects WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Project deleted!' });
    });
});

// --- Posts Routes ---
app.get('/api/posts', (req, res) => {
    db.all(`SELECT * FROM posts ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json(rows);
    });
});

app.post('/api/posts', authenticateToken, (req, res) => {
    const { title, content } = req.body;
    const date = new Date().toISOString();
    db.run(`INSERT INTO posts (title, content, date) VALUES (?, ?, ?)`,
        [title, content, date], function (err) {
            if (err) return res.status(500).json({ success: false, message: err.message });
            res.json({ success: true, message: 'Post added!' });
        });
});

app.delete('/api/posts/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM posts WHERE id = ?`, req.params.id, function (err) {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, message: 'Post deleted!' });
    });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});