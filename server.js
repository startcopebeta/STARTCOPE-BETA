const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { storage } = require('./server/storage');

const app = express();
const PORT = 5000;
const ADMIN_PASSWORD = '1989';
const EARNINGS_PER_VIEW = 2.0;

const DATA_FILE = 'data.json';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({
    secret: process.env.SESSION_SECRET || 'starcope-maps-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}));

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
    
    const { gcash_number, amount, note } = req.body;
    
    if (!gcash_number || typeof gcash_number !== 'string') {
        return res.status(400).json({ success: false, message: 'GCash number is required' });
    }
    
    const gcashPattern = /^09\d{9}$/;
    if (!gcashPattern.test(gcash_number)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid GCash number. Must be 11 digits starting with 09' 
        });
    }
    
    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid amount' });
    }
    
    const totalViews = data.views.length;
    const totalEarnings = totalViews * EARNINGS_PER_VIEW;
    const totalWithdrawn = data.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalEarnings - totalWithdrawn;
    
    if (amount > availableBalance) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    const withdrawal = {
        gcash_number: gcash_number,
        amount: parseFloat(amount),
        note: note || '',
        timestamp: new Date().toISOString(),
        status: 'pending'
    };
    
    data.withdrawals.push(withdrawal);
    saveData(data);
    
    res.json({ 
        success: true, 
        message: `Withdrawal request submitted! ₱${amount.toFixed(2)} will be sent to ${gcash_number}` 
    });
});

app.get('/api/stats', (req, res) => {
    const data = loadData();
    res.json({
        views: data.views.length,
        earnings: data.views.length * EARNINGS_PER_VIEW,
        earningsPerView: EARNINGS_PER_VIEW
    });
});

app.post('/api/register', async (req, res) => {
    try {
        const { username, phoneNumber, password, firstName, lastName } = req.body;
        
        if (!username || !phoneNumber || !password) {
            return res.status(400).json({ success: false, message: 'Username, phone number, and password are required' });
        }

        if (password.length < 4) {
            return res.status(400).json({ success: false, message: 'Password must be at least 4 characters' });
        }

        const phonePattern = /^09\d{9}$/;
        if (!phonePattern.test(phoneNumber)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid phone number. Must be 11 digits starting with 09' 
            });
        }

        const existing = await storage.getUserByUsername(username);
        if (existing) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await storage.upsertUser({
            username,
            password: hashedPassword,
            phoneNumber,
            firstName: firstName || '',
            lastName: lastName || ''
        });

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Registration failed' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }

        const user = await storage.getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;

        res.json({ success: true, user: { id: user.id, username: user.username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Login failed' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Logout failed' });
        }
        res.json({ success: true });
    });
});

app.get('/api/user/profile', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const user = await storage.getUser(req.session.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const savings = await storage.getUserSavings(user.id);

        res.json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                phoneNumber: user.phoneNumber,
                firstName: user.firstName,
                lastName: user.lastName,
                profileImageUrl: user.profileImageUrl,
                balance: savings ? savings.balance : '0.00'
            }
        });
    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to load profile' });
    }
});

app.post('/api/savings/deposit', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const { amount, notes } = req.body;
        const depositAmount = parseFloat(amount);

        if (!depositAmount || depositAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid deposit amount' });
        }

        const result = await storage.deposit(req.session.userId, depositAmount, notes);

        res.json({
            success: true,
            message: `Successfully deposited ₱${depositAmount.toFixed(2)} to STAR SAVINGS`,
            newBalance: result.newBalance
        });
    } catch (error) {
        console.error('Deposit error:', error);
        res.status(500).json({ success: false, message: 'Deposit failed' });
    }
});

app.post('/api/savings/withdraw', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const { amount, notes } = req.body;
        const withdrawAmount = parseFloat(amount);

        if (!withdrawAmount || withdrawAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid withdrawal amount' });
        }

        const result = await storage.withdraw(req.session.userId, withdrawAmount, notes);

        if (!result.success) {
            return res.status(400).json({ success: false, message: result.error });
        }

        res.json({
            success: true,
            message: `Successfully withdrew ₱${withdrawAmount.toFixed(2)} from STAR SAVINGS`,
            newBalance: result.newBalance
        });
    } catch (error) {
        console.error('Withdrawal error:', error);
        res.status(500).json({ success: false, message: 'Withdrawal failed' });
    }
});

app.get('/api/savings/transactions', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ success: false, message: 'Not authenticated' });
        }

        const limit = parseInt(req.query.limit) || 50;
        const transactions = await storage.getTransactionHistory(req.session.userId, limit);

        res.json({ success: true, transactions });
    } catch (error) {
        console.error('Transaction history error:', error);
        res.status(500).json({ success: false, message: 'Failed to load transactions' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`STARCOPE MAPS server running on http://0.0.0.0:${PORT}`);
});
