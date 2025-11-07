
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// DeOracle API configuration
const DEORACLE_API_URL = 'https://deoracle.com.ng/api/v2';
const API_KEY = '4f6239536da10f6d18a40b84c81b0a85';

// Serve static files from the public directory
app.use(express.static('public'));

// API endpoint to fetch data from DeOracle
app.get('/api/deoracle', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const response = await fetch(DEORACLE_API_URL, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`DeOracle API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from DeOracle:', error);
        res.status(500).json({ error: 'Failed to fetch data from DeOracle API' });
    }
});

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Website server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Ready to host your website!`);
    console.log(`🔗 DeOracle API integrated`);
});
