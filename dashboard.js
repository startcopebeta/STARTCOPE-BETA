
let currentUser = null;
let allPosts = [];
let allUsers = [];
let notifications = [];
let currentViewerIndex = 0;

window.addEventListener('load', () => {
    checkUserSetup();
    initializeDashboard();
});

function checkUserSetup() {
    const savedUser = localStorage.getItem('starcopeUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        document.getElementById('setupModal').style.display = 'none';
        loadUserData();
    } else {
        document.getElementById('setupModal').style.display = 'flex';
    }
}

function initializeDashboard() {
    document.getElementById('setupSubmit').addEventListener('click', setupUser);
    document.getElementById('setupName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') setupUser();
    });

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            switchSection(e.target.closest('.nav-item').dataset.section);
        });
    });

    document.getElementById('addPhotoBtn').addEventListener('click', () => {
        const input = document.getElementById('mediaInput');
        input.accept = 'image/*';
        input.click();
    });

    document.getElementById('addVideoBtn').addEventListener('click', () => {
        const input = document.getElementById('mediaInput');
        input.accept = 'video/*';
        input.click();
    });

    document.getElementById('mediaInput').addEventListener('change', handleMediaUpload);
    document.getElementById('publishPostBtn').addEventListener('click', publishPost);
    document.getElementById('notificationBtn').addEventListener('click', toggleNotifications);
    document.getElementById('closeNotifications').addEventListener('click', () => {
        document.getElementById('notificationPanel').classList.remove('active');
    });

    document.getElementById('prevViewer').addEventListener('click', () => navigateViewers(-1));
    document.getElementById('nextViewer').addEventListener('click', () => navigateViewers(1));

    document.getElementById('backToMapsBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    loadDashboardData();
}

function setupUser() {
    const name = document.getElementById('setupName').value.trim();
    if (!name) {
        alert('Please enter your name');
        return;
    }

    currentUser = {
        id: Date.now().toString(),
        name: name,
        avatar: 'https://i.ibb.co/V4W1p7M/profile.png',
        joinDate: new Date().toISOString(),
        posts: 0,
        likesReceived: 0,
        views: 0
    };

    localStorage.setItem('starcopeUser', JSON.stringify(currentUser));
    document.getElementById('setupModal').style.display = 'none';
    
    addNotification(`Welcome ${name}! Your profile has been successfully created.`);
    loadUserData();
    saveUserToDatabase();
}

function loadUserData() {
    document.getElementById('currentUserName').textContent = currentUser.name;
    document.getElementById('profileUserName').textContent = currentUser.name;
    updateProfileStats();
}

function switchSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(sectionName + 'Section').classList.add('active');
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

    if (sectionName === 'top-viewers') {
        loadTopViewers();
    }
}

function handleMediaUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const preview = document.getElementById('mediaPreview');
        const isVideo = file.type.startsWith('video');
        
        preview.innerHTML = isVideo 
            ? `<video controls src="${event.target.result}"></video>`
            : `<img src="${event.target.result}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

function publishPost() {
    const content = document.getElementById('postContent').value.trim();
    const mediaPreview = document.getElementById('mediaPreview');
    
    if (!content && !mediaPreview.innerHTML) {
        alert('Please add some content or media to your post');
        return;
    }

    const post = {
        id: Date.now().toString(),
        authorId: currentUser.id,
        authorName: currentUser.name,
        authorAvatar: currentUser.avatar,
        content: content,
        media: mediaPreview.innerHTML,
        mediaType: mediaPreview.querySelector('video') ? 'video' : mediaPreview.querySelector('img') ? 'image' : null,
        likes: 0,
        likedBy: [],
        comments: 0,
        views: 0,
        timestamp: new Date().toISOString()
    };

    allPosts.unshift(post);
    currentUser.posts++;
    
    savePostsToDatabase();
    updateUserInDatabase();
    
    document.getElementById('postContent').value = '';
    mediaPreview.innerHTML = '';
    
    renderPosts();
    updateProfileStats();
    addNotification('Your post has been published successfully!');
}

function renderPosts() {
    const container = document.getElementById('postsContainer');
    
    if (allPosts.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No posts yet. Be the first to share!</div>';
        return;
    }

    container.innerHTML = allPosts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <div class="post-header">
                <img src="${post.authorAvatar}" alt="${post.authorName}" class="post-avatar">
                <div class="post-author-info">
                    <h4>${post.authorName}</h4>
                    <span class="post-timestamp">${formatTime(post.timestamp)}</span>
                </div>
            </div>
            ${post.content ? `<div class="post-content">${escapeHtml(post.content)}</div>` : ''}
            ${post.media ? `<div class="post-media">${post.media}</div>` : ''}
            <div class="post-actions-bar">
                <button class="action-btn like-btn ${post.likedBy.includes(currentUser?.id) ? 'liked' : ''}" data-post-id="${post.id}">
                    ❤️ <span>${post.likes}</span>
                </button>
                <button class="action-btn">💬 <span>${post.comments}</span></button>
                <button class="action-btn">👁️ <span>${post.views}</span></button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const postId = e.currentTarget.dataset.postId;
            toggleLike(postId);
        });
    });
}

function toggleLike(postId) {
    const post = allPosts.find(p => p.id === postId);
    if (!post || !currentUser) return;

    const likedIndex = post.likedBy.indexOf(currentUser.id);
    
    if (likedIndex > -1) {
        post.likedBy.splice(likedIndex, 1);
        post.likes--;
    } else {
        post.likedBy.push(currentUser.id);
        post.likes++;
        
        if (post.authorId !== currentUser.id) {
            addNotification(`${currentUser.name} liked your post!`, post.authorId);
        }
    }

    savePostsToDatabase();
    renderPosts();
    updateEngagementStats();
}

function updateProfileStats() {
    document.getElementById('profilePostCount').textContent = currentUser.posts;
    document.getElementById('profileLikeCount').textContent = currentUser.likesReceived;
    document.getElementById('profileViewCount').textContent = currentUser.views;
}

function updateEngagementStats() {
    const userPosts = allPosts.filter(p => p.authorId === currentUser?.id);
    const totalLikes = userPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = userPosts.reduce((sum, p) => sum + p.comments, 0);
    const totalViews = userPosts.reduce((sum, p) => sum + p.views, 0);
    
    document.getElementById('totalLikes').textContent = totalLikes;
    document.getElementById('totalComments').textContent = totalComments;
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('totalEngagement').textContent = totalLikes + totalComments;
    
    currentUser.likesReceived = totalLikes;
    updateUserInDatabase();
}

function loadTopViewers() {
    const viewers = [...allUsers].sort((a, b) => b.views - a.views).slice(0, 10);
    
    if (viewers.length === 0) {
        viewers.push(currentUser);
    }

    const slider = document.getElementById('viewersSlider');
    slider.innerHTML = viewers.map(user => `
        <div class="viewer-card">
            <img src="${user.avatar}" alt="${user.name}" class="viewer-avatar">
            <div class="viewer-name">${user.name}</div>
            <div class="viewer-views">${user.views} views</div>
        </div>
    `).join('');
}

function navigateViewers(direction) {
    const slider = document.getElementById('viewersSlider');
    const cardWidth = 215;
    currentViewerIndex += direction;
    
    const maxIndex = Math.max(0, slider.children.length - 3);
    currentViewerIndex = Math.max(0, Math.min(currentViewerIndex, maxIndex));
    
    slider.style.transform = `translateX(-${currentViewerIndex * cardWidth}px)`;
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    panel.classList.toggle('active');
    
    if (panel.classList.contains('active')) {
        renderNotifications();
        document.getElementById('notificationCount').textContent = '0';
    }
}

function renderNotifications() {
    const list = document.getElementById('notificationsList');
    
    if (notifications.length === 0) {
        list.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;">No notifications yet</div>';
        return;
    }

    list.innerHTML = notifications.reverse().map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}">
            <div class="notification-text">${notif.text}</div>
            <div class="notification-time">${formatTime(notif.timestamp)}</div>
        </div>
    `).join('');
}

function addNotification(text, userId = null) {
    const notification = {
        id: Date.now().toString(),
        text: text,
        timestamp: new Date().toISOString(),
        read: false,
        userId: userId
    };

    notifications.push(notification);
    
    const currentCount = parseInt(document.getElementById('notificationCount').textContent);
    document.getElementById('notificationCount').textContent = currentCount + 1;
    
    saveNotificationsToDatabase();
}

function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function savePostsToDatabase() {
    localStorage.setItem('starcopePosts', JSON.stringify(allPosts));
}

function loadPostsFromDatabase() {
    const saved = localStorage.getItem('starcopePosts');
    if (saved) {
        allPosts = JSON.parse(saved);
        renderPosts();
        updateEngagementStats();
    }
}

function saveUserToDatabase() {
    const users = JSON.parse(localStorage.getItem('starcopeUsers') || '[]');
    const existingIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (existingIndex > -1) {
        users[existingIndex] = currentUser;
    } else {
        users.push(currentUser);
    }
    
    localStorage.setItem('starcopeUsers', JSON.stringify(users));
    allUsers = users;
}

function updateUserInDatabase() {
    localStorage.setItem('starcopeUser', JSON.stringify(currentUser));
    saveUserToDatabase();
}

function loadUsersFromDatabase() {
    const saved = localStorage.getItem('starcopeUsers');
    if (saved) {
        allUsers = JSON.parse(saved);
    }
}

function saveNotificationsToDatabase() {
    localStorage.setItem('starcopeNotifications', JSON.stringify(notifications));
}

function loadNotificationsFromDatabase() {
    const saved = localStorage.getItem('starcopeNotifications');
    if (saved) {
        notifications = JSON.parse(saved);
        const unreadCount = notifications.filter(n => !n.read).length;
        document.getElementById('notificationCount').textContent = unreadCount;
    }
}

function loadDashboardData() {
    loadUsersFromDatabase();
    loadPostsFromDatabase();
    loadNotificationsFromDatabase();
    updateEngagementStats();
}

setInterval(() => {
    allPosts.forEach(post => {
        if (Math.random() < 0.1) {
            post.views++;
        }
    });
    savePostsToDatabase();
}, 5000);
