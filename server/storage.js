const {
  users,
  savings,
  transactions,
} = require("../shared/schema");
const { db } = require("./db");
const { eq, desc } = require("drizzle-orm");

class DatabaseStorage {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async upsertUser(userData) {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    await this.createSavingsAccount(user.id);
    
    return user;
  }

  async getUserSavings(userId) {
    const [savingsAccount] = await db.select().from(savings).where(eq(savings.userId, userId));
    return savingsAccount;
  }

  async createSavingsAccount(userId) {
    const existing = await this.getUserSavings(userId);
    if (existing) return existing;

    const [savingsAccount] = await db
      .insert(savings)
      .values({ userId, balance: '0.00' })
      .returning();
    return savingsAccount;
  }

  async deposit(userId, amount, notes) {
    const savingsAccount = await this.getUserSavings(userId);
    if (!savingsAccount) {
      throw new Error('Savings account not found');
    }

    const currentBalance = parseFloat(savingsAccount.balance);
    const newBalance = currentBalance + amount;

    const [updatedSavings] = await db
      .update(savings)
      .set({ 
        balance: newBalance.toFixed(2),
        updatedAt: new Date()
      })
      .where(eq(savings.userId, userId))
      .returning();

    const [transaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: 'deposit',
        amount: amount.toFixed(2),
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        notes: notes || 'Deposit to STAR SAVINGS',
      })
      .returning();

    return {
      success: true,
      newBalance: updatedSavings.balance,
      transaction,
    };
  }

  async withdraw(userId, amount, notes) {
    const savingsAccount = await this.getUserSavings(userId);
    if (!savingsAccount) {
      return { success: false, newBalance: '0.00', transaction: {}, error: 'Savings account not found' };
    }

    const currentBalance = parseFloat(savingsAccount.balance);
    
    if (currentBalance < amount) {
      return { success: false, newBalance: currentBalance.toFixed(2), transaction: {}, error: 'Insufficient balance' };
    }

    const newBalance = currentBalance - amount;

    const [updatedSavings] = await db
      .update(savings)
      .set({ 
        balance: newBalance.toFixed(2),
        updatedAt: new Date()
      })
      .where(eq(savings.userId, userId))
      .returning();

    const [transaction] = await db
      .insert(transactions)
      .values({
        userId,
        type: 'withdraw',
        amount: amount.toFixed(2),
        balanceBefore: currentBalance.toFixed(2),
        balanceAfter: newBalance.toFixed(2),
        notes: notes || 'Withdrawal from STAR SAVINGS',
      })
      .returning();

    return {
      success: true,
      newBalance: updatedSavings.balance,
      transaction,
    };
  }

  async getTransactionHistory(userId, limit = 50) {
    const txns = await db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt))
      .limit(limit);
    return txns;
  }
}

const storage = new DatabaseStorage();

module.exports = { storage, DatabaseStorage };
