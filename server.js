const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static('.'));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎙️  BRIGADA NEWS FM server running on http://0.0.0.0:${PORT}`);
    console.log(`📻 Broadcasting live on FM 99.5`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is busy, retrying...`);
        setTimeout(() => {
            server.close();
            server.listen(PORT, '0.0.0.0');
        }, 1000);
    }
});
