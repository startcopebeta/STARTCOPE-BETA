
const express = require('express');
const path = require('path');

const app = express();
const PORT = 5000;

// DeOracle API configuration
const DEORACLE_API_URL = 'https://deoracle.com.ng/api/v2';
const API_KEY = '4f6239536da10f6d18a40b84c81b0a85';

// Serve static files from the public directory
app.use(express.static('public'));

// Middleware to parse JSON
app.use(express.json());

// API endpoint to fetch services
app.get('/api/services', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const params = new URLSearchParams({
            key: API_KEY,
            action: 'services'
        });
        
        const response = await fetch(`${DEORACLE_API_URL}?${params}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`DeOracle API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({ error: 'Failed to fetch services from DeOracle API' });
    }
});

// API endpoint to get balance
app.get('/api/balance', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const params = new URLSearchParams({
            key: API_KEY,
            action: 'balance'
        });
        
        const response = await fetch(`${DEORACLE_API_URL}?${params}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`DeOracle API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching balance:', error);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

// API endpoint to place an order
app.post('/api/order', async (req, res) => {
    try {
        const fetch = (await import('node-fetch')).default;
        const { service, link, quantity } = req.body;
        
        const params = new URLSearchParams({
            key: API_KEY,
            action: 'add',
            service: service,
            link: link,
            quantity: quantity
        });
        
        const response = await fetch(`${DEORACLE_API_URL}?${params}`, {
            method: 'POST'
        });
        
        if (!response.ok) {
            throw new Error(`DeOracle API error: ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'Failed to place order' });
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
