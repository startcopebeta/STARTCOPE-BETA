let isPlaying = false;
let currentVolume = 70;
let currentStation = null;
let likeCount = 1234;
let commentCount = 89;
let favorites = [];

const radioStream = document.getElementById('radioStream');
const playBtnFixed = document.getElementById('playBtnFixed');
const playIconFixed = document.getElementById('playIconFixed');
const pauseIconFixed = document.getElementById('pauseIconFixed');
const volumeSliderFixed = document.getElementById('volumeSliderFixed');
const playerStationName = document.getElementById('playerStationName');
const playerStationFrequency = document.getElementById('playerStationFrequency');
const playerStationLogo = document.getElementById('playerStationLogo');

const menuDotsBtn = document.getElementById('menuDotsBtn');
const socialMenuModal = document.getElementById('socialMenuModal');
const closeSocialMenu = document.getElementById('closeSocialMenu');
const postBtn = document.getElementById('postBtn');
const commentBtn = document.getElementById('commentBtn');
const postCreationArea = document.getElementById('postCreationArea');
const commentsSection = document.getElementById('commentsSection');
const submitPostBtn = document.getElementById('submitPostBtn');
const cancelPostBtn = document.getElementById('cancelPostBtn');
const submitCommentBtn = document.getElementById('submitCommentBtn');
const postTextarea = document.getElementById('postTextarea');
const commentInput = document.getElementById('commentInput');
const commentsList = document.getElementById('commentsList');

const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const tickerText = document.getElementById('tickerText');

const newsItems = [
    'Welcome to Brigada News FM - Your trusted source for news and information',
    'BREAKING: Mahalagang anunsyo mula sa pamahalaan tungkol sa bagong patakaran',
    'WEATHER UPDATE: Inaasahang umulan sa Metro Manila ngayong hapon',
    'TRAFFIC ALERT: Heavy traffic sa EDSA southbound dahil sa aksidente',
    'LOCAL NEWS: Bagong health facility binuksan sa Quezon City',
    'SPORTS: Local basketball team nanalo sa championship game'
];
let currentNewsIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    initializePlayer();
    initializeStations();
    initializeNavigation();
    initializeSocialMenu();
    startNewsTicker();
    
    setInterval(updateNewsTicker, 10000);
    
    const defaultStation = radioStations[0];
    updatePlayerUI(defaultStation);
    currentStation = defaultStation;
});

function initializePlayer() {
    playBtnFixed.addEventListener('click', togglePlay);
    volumeSliderFixed.addEventListener('input', updateVolume);
    
    radioStream.volume = currentVolume / 100;
    
    radioStream.addEventListener('play', () => {
        console.log('Audio started playing');
    });
    
    radioStream.addEventListener('pause', () => {
        console.log('Audio paused');
    });
    
    radioStream.addEventListener('error', (e) => {
        console.error('Audio stream error:', e);
        if (isPlaying) {
            handleStreamError('Stream connection lost. Please try reconnecting.');
        }
    });
}

function togglePlay() {
    if (!isPlaying) {
        isPlaying = true;
        playIconFixed.style.display = 'none';
        pauseIconFixed.style.display = 'block';
        
        radioStream.play().catch(err => {
            console.error('Playback failed:', err);
            handleStreamError('Unable to connect to the live stream. Please try again.');
        });
    } else {
        isPlaying = false;
        playIconFixed.style.display = 'block';
        pauseIconFixed.style.display = 'none';
        
        radioStream.pause();
    }
}

function handleStreamError(message) {
    isPlaying = false;
    playIconFixed.style.display = 'block';
    pauseIconFixed.style.display = 'none';
    
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function updateVolume(e) {
    currentVolume = e.target.value;
    radioStream.volume = currentVolume / 100;
}

function initializeStations() {
    const stationsGrid = document.getElementById('stationsGrid');
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    function renderStations(category = 'all') {
        stationsGrid.innerHTML = '';
        
        const filteredStations = category === 'all' 
            ? radioStations 
            : radioStations.filter(station => station.category === category);
        
        filteredStations.forEach(station => {
            const stationCard = document.createElement('div');
            stationCard.className = 'station-card';
            stationCard.innerHTML = `
                <div class="station-header">
                    <div class="station-logo">${station.logo}</div>
                    <div class="station-info">
                        <h3>${station.name}</h3>
                        <div class="station-frequency">${station.frequency}</div>
                    </div>
                </div>
                <div class="station-location">
                    <i class="fas fa-map-marker-alt"></i> ${station.location}
                </div>
                <div class="station-description">${station.description}</div>
                <div class="station-actions">
                    <button class="play-station-btn" data-station-id="${station.id}">
                        <i class="fas fa-play"></i> Play
                    </button>
                    <button class="favorite-btn ${favorites.includes(station.id) ? 'favorited' : ''}" data-station-id="${station.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            `;
            
            const playBtn = stationCard.querySelector('.play-station-btn');
            playBtn.addEventListener('click', () => playStation(station));
            
            const favBtn = stationCard.querySelector('.favorite-btn');
            favBtn.addEventListener('click', (e) => toggleFavorite(station.id, e.target.closest('.favorite-btn')));
            
            stationsGrid.appendChild(stationCard);
        });
    }
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            renderStations(category);
        });
    });
    
    renderStations();
}

function playStation(station) {
    if (currentStation && currentStation.id === station.id && isPlaying) {
        togglePlay();
        return;
    }
    
    radioStream.src = station.stream;
    currentStation = station;
    updatePlayerUI(station);
    
    if (!isPlaying) {
        togglePlay();
    } else {
        radioStream.play();
    }
    
    showNotification(`Now playing: ${station.name}`, 'info');
    
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function updatePlayerUI(station) {
    playerStationName.textContent = station.name;
    playerStationFrequency.textContent = station.frequency;
    playerStationLogo.textContent = station.logo;
}

function toggleFavorite(stationId, btn) {
    const index = favorites.indexOf(stationId);
    if (index > -1) {
        favorites.splice(index, 1);
        btn.classList.remove('favorited');
        showNotification('Removed from favorites', 'info');
    } else {
        favorites.push(stationId);
        btn.classList.add('favorited');
        showNotification('Added to favorites', 'info');
    }
}

function initializeSocialMenu() {
    menuDotsBtn.addEventListener('click', () => {
        socialMenuModal.classList.add('active');
    });
    
    closeSocialMenu.addEventListener('click', () => {
        socialMenuModal.classList.remove('active');
        postCreationArea.style.display = 'none';
        commentsSection.style.display = 'none';
    });
    
    socialMenuModal.addEventListener('click', (e) => {
        if (e.target === socialMenuModal) {
            socialMenuModal.classList.remove('active');
            postCreationArea.style.display = 'none';
            commentsSection.style.display = 'none';
        }
    });
    
    document.querySelector('.like-btn').addEventListener('click', () => {
        likeCount++;
        document.getElementById('likeCount').textContent = formatCount(likeCount);
        showNotification('Liked!', 'info');
    });
    
    document.querySelector('.share-btn').addEventListener('click', () => {
        showNotification('Share link copied to clipboard!', 'info');
    });
    
    commentBtn.addEventListener('click', () => {
        commentsSection.style.display = commentsSection.style.display === 'none' ? 'block' : 'none';
        postCreationArea.style.display = 'none';
    });
    
    postBtn.addEventListener('click', () => {
        postCreationArea.style.display = postCreationArea.style.display === 'none' ? 'block' : 'none';
        commentsSection.style.display = 'none';
    });
    
    submitPostBtn.addEventListener('click', () => {
        const text = postTextarea.value.trim();
        if (text) {
            showNotification('Post created successfully!', 'info');
            postTextarea.value = '';
            postCreationArea.style.display = 'none';
        }
    });
    
    cancelPostBtn.addEventListener('click', () => {
        postTextarea.value = '';
        postCreationArea.style.display = 'none';
    });
    
    submitCommentBtn.addEventListener('click', () => {
        const text = commentInput.value.trim();
        if (text) {
            addComment(text);
            commentInput.value = '';
            commentCount++;
            document.getElementById('commentCount').textContent = commentCount;
        }
    });
    
    commentInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitCommentBtn.click();
        }
    });
}

function addComment(text) {
    const commentItem = document.createElement('div');
    commentItem.className = 'comment-item';
    commentItem.innerHTML = `
        <div class="comment-avatar">👤</div>
        <div class="comment-content">
            <div class="comment-author">You</div>
            <div class="comment-text">${text}</div>
            <div class="comment-time">Just now</div>
        </div>
    `;
    
    commentsList.insertBefore(commentItem, commentsList.firstChild);
    showNotification('Comment added!', 'info');
}

function formatCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
}

function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function startNewsTicker() {
    tickerText.textContent = newsItems[0];
}

function updateNewsTicker() {
    currentNewsIndex = (currentNewsIndex + 1) % newsItems.length;
    tickerText.textContent = newsItems[currentNewsIndex];
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.news-card, .schedule-card, .stat-card, .station-card, .video-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('Brigada News FM initialized successfully!');
