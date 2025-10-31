
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('.'));

const STATS_FILE = 'stats.json';
const STATUS_FILE = 'status.json';

function readStats() {
    try {
        if (fs.existsSync(STATS_FILE)) {
            const data = fs.readFileSync(STATS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error reading stats:', err);
    }
    return { totalViews: 0, countriesExplored: [] };
}

function writeStats(stats) {
    try {
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (err) {
        console.error('Error writing stats:', err);
    }
}

function readStatus() {
    try {
        if (fs.existsSync(STATUS_FILE)) {
            const data = fs.readFileSync(STATUS_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (err) {
        console.error('Error reading status:', err);
    }
    return { maintenance: false, down: false };
}

function writeStatus(status) {
    try {
        fs.writeFileSync(STATUS_FILE, JSON.stringify(status, null, 2));
    } catch (err) {
        console.error('Error writing status:', err);
    }
}

app.get('/api/stats', (req, res) => {
    const stats = readStats();
    res.json(stats);
});

app.post('/api/stats', (req, res) => {
    const stats = req.body;
    writeStats(stats);
    res.json({ success: true });
});

app.get('/api/status', (req, res) => {
    const status = readStatus();
    res.json(status);
});

app.post('/api/status', (req, res) => {
    const currentStatus = readStatus();
    const newStatus = { ...currentStatus, ...req.body };
    writeStatus(newStatus);
    res.json({ success: true, ...newStatus });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STARCOPE MAPS server running on http://0.0.0.0:${PORT}`);
});
