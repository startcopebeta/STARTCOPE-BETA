// Radio Player State
let isPlaying = false;
let currentVolume = 70;

// DOM Elements
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const playIcon = document.querySelector('.play-icon');
const pauseIcon = document.querySelector('.pause-icon');
const listenerCount = document.getElementById('listenerCount');
const tickerText = document.getElementById('tickerText');
const contactForm = document.getElementById('contactForm');
const radioStream = document.getElementById('radioStream');

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

// Programs Schedule
const programs = [
    {
        time: '6:00-9:00',
        name: 'Brigada Umaga',
        host: 'DJ Mike Santos',
        timeRange: [6, 9]
    },
    {
        time: '9:00-12:00',
        name: 'Brigada Balita',
        host: 'Maria Cruz',
        timeRange: [9, 12]
    },
    {
        time: '12:00-15:00',
        name: 'Tanghali Patrol',
        host: 'Jun Reyes',
        timeRange: [12, 15]
    },
    {
        time: '15:00-18:00',
        name: 'Hapon Express',
        host: 'Sarah Gonzales',
        timeRange: [15, 18]
    },
    {
        time: '18:00-21:00',
        name: 'Gabi ng Balita',
        host: 'Tony Villanueva',
        timeRange: [18, 21]
    },
    {
        time: '21:00-24:00',
        name: 'Nightcap News',
        host: 'DJ Mica',
        timeRange: [21, 24]
    }
];

// Breaking News Ticker
const newsItems = [
    'Welcome to Brigada News FM - Your trusted source for news and information',
    'BREAKING: Mahalagang anunsyo mula sa pamahalaan tungkol sa bagong patakaran',
    'WEATHER UPDATE: Inaasahang umulan sa Metro Manila ngayong hapon',
    'TRAFFIC ALERT: Heavy traffic sa EDSA southbound dahil sa aksidente',
    'LOCAL NEWS: Bagong health facility binuksan sa Quezon City',
    'SPORTS: Local basketball team nanalo sa championship game'
];

let currentNewsIndex = 0;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentProgram();
    initializePlayer();
    initializeNavigation();
    startNewsTicker();
    updateListenerCount();
    
    // Update program every minute
    setInterval(updateCurrentProgram, 60000);
    
    // Update listener count every 5 seconds
    setInterval(updateListenerCount, 5000);
    
    // Rotate news ticker every 10 seconds
    setInterval(updateNewsTicker, 10000);
});

// Play/Pause Functionality
function initializePlayer() {
    playBtn.addEventListener('click', togglePlay);
    volumeSlider.addEventListener('input', updateVolume);
    
    // Set initial volume
    radioStream.volume = currentVolume / 100;
    
    // Handle audio events
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
        // Try to start playing
        isPlaying = true;
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
        playBtn.style.background = 'linear-gradient(135deg, #27ae60, #229954)';
        
        // Play the actual audio stream
        radioStream.play().catch(err => {
            console.error('Playback failed:', err);
            handleStreamError('Unable to connect to the live stream. Please try again.');
        });
    } else {
        // Stop playing
        isPlaying = false;
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
        playBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
        
        // Pause the actual audio stream
        radioStream.pause();
    }
}

function handleStreamError(message) {
    // Reset UI to stopped state
    isPlaying = false;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    playBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
    
    // Show error to user
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    // Create notification element
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
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function updateVolume(e) {
    currentVolume = e.target.value;
    radioStream.volume = currentVolume / 100;
    console.log('Volume:', currentVolume + '%');
}

// Update Current Program based on time
function updateCurrentProgram() {
    const now = new Date();
    const currentHour = now.getHours();
    
    const currentProgram = programs.find(program => {
        return currentHour >= program.timeRange[0] && currentHour < program.timeRange[1];
    });
    
    if (currentProgram) {
        document.getElementById('currentProgram').textContent = currentProgram.name;
        document.getElementById('currentHost').textContent = currentProgram.host;
        
        // Update active schedule card
        const scheduleCards = document.querySelectorAll('.schedule-card');
        scheduleCards.forEach((card, index) => {
            card.classList.remove('active');
            if (programs[index] === currentProgram) {
                card.classList.add('active');
            }
        });
    }
}

// Navigation
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
    
    // Update active nav on scroll
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

// News Ticker
function startNewsTicker() {
    tickerText.textContent = newsItems[0];
}

function updateNewsTicker() {
    currentNewsIndex = (currentNewsIndex + 1) % newsItems.length;
    tickerText.textContent = newsItems[currentNewsIndex];
}

// Simulate listener count updates
function updateListenerCount() {
    const baseCount = 1200;
    const variance = Math.floor(Math.random() * 100);
    const newCount = baseCount + variance;
    
    listenerCount.textContent = newCount.toLocaleString();
}

// Contact Form
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Show success message
    alert('Salamat sa iyong mensahe! Makikipag-ugnayan kami sa iyo sa lalong madaling panahon.');
    contactForm.reset();
});

// Smooth scroll for all anchor links
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

// Add entrance animations
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

// Observe news cards and schedule cards
document.querySelectorAll('.news-card, .schedule-card, .stat-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

console.log('Brigada News FM initialized successfully!');
