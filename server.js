const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// --- Routes ---
// Serve the main portfolio frontend
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, '0.0.0.0', () => {
    const P = String(PORT);
    console.clear();
    console.log('\n\x1b[38;2;139;92;246m╭' + '─'.repeat(54) + '╮\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[1m\x1b[38;2;255;255;255mSOHAM.DEV \x1b[38;2;167;139;250m// CORE TERMINAL INITIALIZATION\x1b[0m      \x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m├' + '─'.repeat(54) + '┤\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;16;185;129m[✔]\x1b[0m Static File Engine Attached                   \x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;16;185;129m[✔]\x1b[0m Cross-Origin Resource Sharing Enabled         \x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;16;185;129m[✔]\x1b[0m Memory Buffer & JSON Parsers Secured          \x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m├' + '─'.repeat(54) + '┤\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;148;163;184mSERVER PORT :\x1b[0m \x1b[1m\x1b[38;2;250;204;21m' + P.padEnd(39) + '\x1b[0m\x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;148;163;184mURL (LOCAL) :\x1b[0m \x1b[4m\x1b[38;2;56;189;248mhttp://localhost:' + P.padEnd(23) + '\x1b[0m\x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m│\x1b[0m  \x1b[38;2;148;163;184mURL (NET)   :\x1b[0m \x1b[4m\x1b[38;2;56;189;248mhttp://0.0.0.0:' + P.padEnd(25) + '\x1b[0m\x1b[38;2;139;92;246m│\x1b[0m');
    console.log('\x1b[38;2;139;92;246m╰' + '─'.repeat(54) + '╯\x1b[0m');
    console.log('\n\x1b[38;2;100;116;139m>  Awaiting telemetry connections...\x1b[0m\n');
});