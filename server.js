
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(express.static('.'));

const STATS_FILE = 'stats.json';

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

app.get('/api/stats', (req, res) => {
    const stats = readStats();
    res.json(stats);
});

app.post('/api/stats', (req, res) => {
    const stats = req.body;
    writeStats(stats);
    res.json({ success: true });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STARCOPE MAPS server running on http://0.0.0.0:${PORT}`);
});
