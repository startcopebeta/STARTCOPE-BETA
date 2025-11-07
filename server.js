
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Website server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Ready to host your website!`);
});
