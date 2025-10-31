const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const ADMIN_PASSWORD = '1989';
const EARNINGS_PER_VIEW = 2.0;

const DATA_FILE = 'data.json';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function loadData() {
    if (fs.existsSync(DATA_FILE)) {
        const rawData = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(rawData);
    }
    return {
        views: [],
        withdrawals: [],
        sessions: {}
    };
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

app.post('/api/track-view', (req, res) => {
    const data = loadData();
    const viewData = {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.headers['user-agent'] || 'Unknown'
    };
    data.views.push(viewData);
    saveData(data);
    res.json({ 
        success: true, 
        totalViews: data.views.length,
        totalEarnings: data.views.length * EARNINGS_PER_VIEW
    });
});

app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        const sessionId = Math.random().toString(36).substring(7);
        const data = loadData();
        data.sessions[sessionId] = { createdAt: new Date().toISOString() };
        saveData(data);
        res.json({ success: true, sessionId });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.get('/api/admin/stats', (req, res) => {
    const sessionId = req.headers['authorization'];
    const data = loadData();
    
    if (!sessionId || !data.sessions[sessionId]) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const totalViews = data.views.length;
    const totalEarnings = totalViews * EARNINGS_PER_VIEW;
    const totalWithdrawn = data.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalEarnings - totalWithdrawn;
    
    res.json({
        success: true,
        totalViews,
        totalEarnings,
        totalWithdrawn,
        availableBalance,
        earningsPerView: EARNINGS_PER_VIEW,
        recentViews: data.views.slice(-50).reverse(),
        withdrawals: data.withdrawals.reverse()
    });
});

app.post('/api/admin/withdraw', (req, res) => {
    const sessionId = req.headers['authorization'];
    const data = loadData();
    
    if (!sessionId || !data.sessions[sessionId]) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { amount, note } = req.body;
    const totalViews = data.views.length;
    const totalEarnings = totalViews * EARNINGS_PER_VIEW;
    const totalWithdrawn = data.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalEarnings - totalWithdrawn;
    
    if (amount > availableBalance) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    const withdrawal = {
        amount: parseFloat(amount),
        note: note || '',
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    
    data.withdrawals.push(withdrawal);
    saveData(data);
    
    res.json({ success: true, message: 'Withdrawal successful' });
});

app.get('/api/stats', (req, res) => {
    const data = loadData();
    res.json({
        views: data.views.length,
        earnings: data.views.length * EARNINGS_PER_VIEW,
        earningsPerView: EARNINGS_PER_VIEW
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STARCOPE MAPS server running on http://0.0.0.0:${PORT}`);
});
