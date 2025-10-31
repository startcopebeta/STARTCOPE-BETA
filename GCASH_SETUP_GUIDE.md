# 📱 GCash Real Money Withdrawal Setup Guide

## Current Status
✅ **GCash Number Field** - Added to withdrawal form
✅ **Withdrawal Tracking** - System stores GCash numbers and withdrawal requests
⚠️ **Real Money Transfer** - Requires PayMongo setup (see below)

---

## How to Enable REAL Money Transfers to GCash

Para magsend ng **REAL MONEY** sa GCash numbers, kailangan mo gawin ang mga steps na ito:

### Step 1: Create PayMongo Account
1. Go to https://www.paymongo.com/
2. Click "Sign Up" 
3. Register your business details
4. Complete KYC (Know Your Customer) verification
   - Business registration documents
   - Valid ID
   - Proof of address

### Step 2: Get API Keys
1. Login to PayMongo Dashboard
2. Go to "Developers" → "API Keys"
3. Copy your:
   - **Secret Key** (sk_test_... for testing)
   - **Public Key** (pk_test_... for testing)

### Step 3: Add API Keys to Replit

#### Option A: Using Secrets (Recommended)
1. In Replit, click "Secrets" (🔒 icon in left sidebar)
2. Add these secrets:
   - Key: `PAYMONGO_SECRET_KEY`
   - Value: Your secret key from PayMongo

#### Option B: Using Environment Variables
Add to your `.env` file:
```
PAYMONGO_SECRET_KEY=sk_test_your_secret_key_here
```

### Step 4: Install PayMongo Package
Run in Shell:
```bash
npm install --save axios
```

### Step 5: Update server.js Code

Add this code at the top of `server.js`:
```javascript
const axios = require('axios');
const PAYMONGO_SECRET_KEY = process.env.PAYMONGO_SECRET_KEY || '';
```

Replace the `/api/admin/withdraw` endpoint with this code:

```javascript
app.post('/api/admin/withdraw', async (req, res) => {
    const sessionId = req.headers['authorization'];
    const data = loadData();
    
    if (!sessionId || !data.sessions[sessionId]) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    
    const { gcash_number, amount, note } = req.body;
    const totalViews = data.views.length;
    const totalEarnings = totalViews * EARNINGS_PER_VIEW;
    const totalWithdrawn = data.withdrawals.reduce((sum, w) => sum + w.amount, 0);
    const availableBalance = totalEarnings - totalWithdrawn;
    
    if (amount > availableBalance) {
        return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }
    
    // REAL MONEY TRANSFER TO GCASH
    try {
        // Create GCash payment source with PayMongo
        const response = await axios.post(
            'https://api.paymongo.com/v1/sources',
            {
                data: {
                    attributes: {
                        type: 'gcash',
                        amount: Math.round(amount * 100), // Convert to centavos
                        currency: 'PHP',
                        redirect: {
                            success: `${process.env.REPL_SLUG || 'your-app'}.repl.co/withdraw-success`,
                            failed: `${process.env.REPL_SLUG || 'your-app'}.repl.co/withdraw-failed`
                        }
                    }
                }
            },
            {
                auth: {
                    username: PAYMONGO_SECRET_KEY,
                    password: ''
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const withdrawal = {
            gcash_number: gcash_number,
            amount: parseFloat(amount),
            note: note || '',
            timestamp: new Date().toISOString(),
            status: 'pending',
            payment_id: response.data.data.id,
            checkout_url: response.data.data.attributes.redirect.checkout_url
        };
        
        data.withdrawals.push(withdrawal);
        saveData(data);
        
        res.json({ 
            success: true, 
            message: `Withdrawal initiated! ₱${amount.toFixed(2)} will be sent to ${gcash_number}`,
            checkout_url: withdrawal.checkout_url
        });
        
    } catch (error) {
        console.error('PayMongo Error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to process withdrawal. Please check API keys.' 
        });
    }
});
```

---

## Important Notes

### 💰 Pricing
- **PayMongo fees**: ~2.5% + ₱15 per transaction
- Check latest fees at: https://www.paymongo.com/pricing

### 🔐 Security
- NEVER commit API keys to git
- Always use Replit Secrets or environment variables
- Use test keys (`sk_test_...`) during development
- Switch to live keys (`sk_live_...`) only when ready for production

### 📝 Testing
1. Use test mode first with test API keys
2. Test with small amounts (₱10-100)
3. Verify webhooks are working
4. Check transaction logs in PayMongo dashboard

### 🚀 Going Live
1. Complete PayMongo business verification
2. Wait for approval (usually 1-3 business days)
3. Switch from test keys to live keys
4. Test with real small amount first
5. Monitor transactions closely

---

## Alternative: Manual Processing

If ayaw mo gumamit ng PayMongo, pwede mo i-process manually:

1. Withdrawal requests save sa `data.json`
2. Check withdrawals regularly sa admin dashboard  
3. Manually send money sa GCash app
4. Update status from "pending" to "completed" in `data.json`

---

## Support

### PayMongo Support
- Website: https://www.paymongo.com/
- Docs: https://developers.paymongo.com/
- Email: support@paymongo.com

### Questions?
Check the PayMongo documentation for detailed integration guides:
https://developers.paymongo.com/docs/accepting-gcash-payments

---

## Current System Features

✅ Automatic view tracking
✅ Earnings calculation (₱2.00 per view)
✅ GCash number validation
✅ Withdrawal request tracking
✅ Admin dashboard with real-time updates
✅ No withdrawal limits (up to available balance)

To enable real money transfers, follow Steps 1-5 above!
