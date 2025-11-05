const GEMINI_API_URL = 'https://betadash-api-swordslush-production.up.railway.app/gemini';

let currentUser = null;
let chatHistory = [];
let settings = {
    darkMode: false,
    fontSize: 'medium',
    responseStyle: 'balanced',
    autoSave: true,
    sound: false
};

window.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    loadSettings();
    checkAuth();
    setupEventListeners();
}

function checkAuth() {
    try {
        const user = localStorage.getItem('starAgent_user');
        if (user) {
            currentUser = JSON.parse(user);
            if (currentUser && currentUser.id && currentUser.provider) {
                showMainApp();
                return;
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('starAgent_user');
    }
    showLoginScreen();
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
}

function showMainApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'grid';
    loadUserProfile();
    loadChatHistory();
    updateStorageInfo();
}

function loginWith(provider) {
    if (!provider || !['google', 'facebook', 'github'].includes(provider)) {
        alert('Invalid login provider');
        return;
    }

    const providerData = {
        google: {
            name: 'Demo User (Google)',
            email: `demo.${Date.now()}@gmail.com`,
            avatar: 'G',
            provider: 'google',
            color: '#4285f4'
        },
        facebook: {
            name: 'Demo User (Facebook)',
            email: `demo.${Date.now()}@facebook.com`,
            avatar: 'F',
            provider: 'facebook',
            color: '#1877f2'
        },
        github: {
            name: 'Demo User (GitHub)',
            email: `demo.${Date.now()}@users.github.com`,
            avatar: 'GH',
            provider: 'github',
            color: '#333'
        }
    };

    try {
        currentUser = {
            ...providerData[provider],
            id: Date.now(),
            loginDate: new Date().toISOString()
        };

        localStorage.setItem('starAgent_user', JSON.stringify(currentUser));
        showMainApp();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('starAgent_user');
        localStorage.removeItem('starAgent_history');
        localStorage.removeItem('starAgent_settings');
        currentUser = null;
        chatHistory = [];
        settings = {
            darkMode: false,
            fontSize: 'medium',
            responseStyle: 'balanced',
            autoSave: true,
            sound: false
        };
        document.body.classList.remove('dark-mode');
        showLoginScreen();
    }
}

function loadUserProfile() {
    if (!currentUser) return;
    
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('userAvatar').textContent = currentUser.avatar;
    
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(avatar => {
        avatar.textContent = currentUser.avatar;
    });
}

function setupEventListeners() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            switchPage(page);
        });
    });

    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    chatInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });

    document.getElementById('darkModeToggle').addEventListener('change', (e) => {
        settings.darkMode = e.target.checked;
        applySettings();
        saveSettings();
    });

    document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
        settings.fontSize = e.target.value;
        applySettings();
        saveSettings();
    });

    document.getElementById('responseStyleSelect').addEventListener('change', (e) => {
        settings.responseStyle = e.target.value;
        saveSettings();
    });

    document.getElementById('autoSaveToggle').addEventListener('change', (e) => {
        settings.autoSave = e.target.checked;
        saveSettings();
    });

    document.getElementById('soundToggle').addEventListener('change', (e) => {
        settings.sound = e.target.checked;
        saveSettings();
    });
}

function switchPage(page) {
    const pages = document.querySelectorAll('.page');
    const navButtons = document.querySelectorAll('.nav-btn');

    pages.forEach(p => p.classList.remove('active'));
    navButtons.forEach(btn => btn.classList.remove('active'));

    document.getElementById(page + 'Page').classList.add('active');
    document.querySelector(`[data-page="${page}"]`).classList.add('active');

    if (page === 'history') {
        loadHistoryPage();
    } else if (page === 'settings') {
        updateStorageInfo();
    }
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    const chatContainer = document.getElementById('chatContainer');
    const welcomeMessage = chatContainer.querySelector('.welcome-message');
    if (welcomeMessage) {
        welcomeMessage.remove();
    }

    addMessage('user', message);
    input.value = '';
    input.style.height = 'auto';

    const typingIndicator = addTypingIndicator();

    try {
        const response = await fetch(`${GEMINI_API_URL}?ask=${encodeURIComponent(message)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        typingIndicator.remove();

        const botResponse = data.response || 'Sorry, I could not process that.';
        addMessage('bot', botResponse);

        if (settings.autoSave) {
            saveChatToHistory(message, botResponse);
        }

    } catch (error) {
        console.error('Chat error:', error);
        typingIndicator.remove();
        addMessage('bot', 'I\'m having trouble connecting right now. Please check your internet connection and try again.');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function addMessage(type, content) {
    const chatContainer = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = type === 'user' ? currentUser.avatar : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    const escapedContent = escapeHtml(content);
    contentDiv.innerHTML = escapedContent.replace(/\n/g, '<br>');

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addTypingIndicator() {
    const chatContainer = document.getElementById('chatContainer');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot';
    typingDiv.id = 'typing-indicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = '🤖';

    const indicatorDiv = document.createElement('div');
    indicatorDiv.className = 'message-content';
    const typingSpan = document.createElement('div');
    typingSpan.className = 'typing-indicator';
    typingSpan.innerHTML = '<span></span><span></span><span></span>';
    indicatorDiv.appendChild(typingSpan);

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(indicatorDiv);
    chatContainer.appendChild(typingDiv);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    return typingDiv;
}

function saveChatToHistory(userMessage, botResponse) {
    const chatEntry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        userMessage: userMessage,
        botResponse: botResponse
    };

    chatHistory.unshift(chatEntry);

    if (chatHistory.length > 100) {
        chatHistory = chatHistory.slice(0, 100);
    }

    localStorage.setItem('starAgent_history', JSON.stringify(chatHistory));
}

function loadChatHistory() {
    const saved = localStorage.getItem('starAgent_history');
    if (saved) {
        chatHistory = JSON.parse(saved);
    }
}

function loadHistoryPage() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (chatHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <p>No chat history yet</p>
                <p>Start a conversation to see your history here</p>
            </div>
        `;
        return;
    }

    chatHistory.forEach(entry => {
        const item = document.createElement('div');
        item.className = 'history-item';
        
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleString();

        item.innerHTML = `
            <div class="history-item-header">
                <span class="history-item-date">${dateStr}</span>
            </div>
            <div class="history-item-preview"><strong>You:</strong> ${entry.userMessage}</div>
            <div class="history-item-preview"><strong>AI:</strong> ${entry.botResponse}</div>
        `;

        historyList.appendChild(item);
    });
}

function clearHistory() {
    if (confirm('Are you sure you want to clear all chat history?')) {
        chatHistory = [];
        localStorage.removeItem('starAgent_history');
        loadHistoryPage();
    }
}

function loadSettings() {
    const saved = localStorage.getItem('starAgent_settings');
    if (saved) {
        settings = { ...settings, ...JSON.parse(saved) };
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem('starAgent_settings', JSON.stringify(settings));
}

function applySettings() {
    document.getElementById('darkModeToggle').checked = settings.darkMode;
    document.getElementById('fontSizeSelect').value = settings.fontSize;
    document.getElementById('responseStyleSelect').value = settings.responseStyle;
    document.getElementById('autoSaveToggle').checked = settings.autoSave;
    document.getElementById('soundToggle').checked = settings.sound;

    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    document.body.style.fontSize = settings.fontSize === 'small' ? '14px' :
                                    settings.fontSize === 'large' ? '18px' : '16px';
}

function updateStorageInfo() {
    const totalSize = JSON.stringify(localStorage).length;
    const sizeKB = (totalSize / 1024).toFixed(2);
    document.getElementById('storageInfo').textContent = `${sizeKB} KB used`;
}

function clearAllData() {
    if (confirm('This will delete all your data including chat history and settings. Are you sure?')) {
        if (confirm('This action cannot be undone. Continue?')) {
            localStorage.clear();
            location.reload();
        }
    }
}
