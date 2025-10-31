
const countries = {
    'philippines': {
        coords: [12.8797, 121.7740],
        zoom: 6,
        name: 'Philippines',
        info: 'An archipelagic country in Southeast Asia with over 7,000 islands. Known for beautiful beaches, rich culture, and friendly people.',
        capital: 'Manila',
        population: '113 million',
        language: 'Filipino, English'
    },
    'japan': {
        coords: [36.2048, 138.2529],
        zoom: 5,
        name: 'Japan',
        info: 'An island nation in East Asia known for its ancient temples, modern technology, cherry blossoms, and rich cultural heritage.',
        capital: 'Tokyo',
        population: '125 million',
        language: 'Japanese'
    },
    'usa': {
        coords: [37.0902, -95.7129],
        zoom: 4,
        name: 'United States',
        info: 'A large country in North America known for its diverse landscapes, major cities, and cultural influence worldwide.',
        capital: 'Washington D.C.',
        population: '331 million',
        language: 'English'
    },
    'uk': {
        coords: [55.3781, -3.4360],
        zoom: 6,
        name: 'United Kingdom',
        info: 'An island nation in Northwestern Europe comprising England, Scotland, Wales, and Northern Ireland. Rich in history and culture.',
        capital: 'London',
        population: '67 million',
        language: 'English'
    },
    'france': {
        coords: [46.2276, 2.2137],
        zoom: 6,
        name: 'France',
        info: 'A Western European country famous for its art, cuisine, fashion, and iconic landmarks like the Eiffel Tower.',
        capital: 'Paris',
        population: '67 million',
        language: 'French'
    },
    'germany': {
        coords: [51.1657, 10.4515],
        zoom: 6,
        name: 'Germany',
        info: 'A Central European country known for its engineering, automotive industry, rich history, and beautiful castles.',
        capital: 'Berlin',
        population: '83 million',
        language: 'German'
    },
    'italy': {
        coords: [41.8719, 12.5674],
        zoom: 6,
        name: 'Italy',
        info: 'A Southern European country famous for its ancient history, art, architecture, and world-renowned cuisine.',
        capital: 'Rome',
        population: '60 million',
        language: 'Italian'
    },
    'spain': {
        coords: [40.4637, -3.7492],
        zoom: 6,
        name: 'Spain',
        info: 'A vibrant country in Southern Europe known for its diverse culture, flamenco dancing, and beautiful beaches.',
        capital: 'Madrid',
        population: '47 million',
        language: 'Spanish'
    },
    'canada': {
        coords: [56.1304, -106.3468],
        zoom: 4,
        name: 'Canada',
        info: 'The second-largest country in the world, known for its vast wilderness, multicultural cities, and friendly people.',
        capital: 'Ottawa',
        population: '38 million',
        language: 'English, French'
    },
    'australia': {
        coords: [-25.2744, 133.7751],
        zoom: 4,
        name: 'Australia',
        info: 'A country and continent surrounded by ocean, famous for unique wildlife, beaches, and the Great Barrier Reef.',
        capital: 'Canberra',
        population: '26 million',
        language: 'English'
    },
    'brazil': {
        coords: [-14.2350, -51.9253],
        zoom: 4,
        name: 'Brazil',
        info: 'The largest country in South America, known for Amazon rainforest, Carnival festival, and soccer culture.',
        capital: 'Brasília',
        population: '214 million',
        language: 'Portuguese'
    },
    'india': {
        coords: [20.5937, 78.9629],
        zoom: 5,
        name: 'India',
        info: 'A South Asian country known for its diverse culture, ancient history, spiritual heritage, and spicy cuisine.',
        capital: 'New Delhi',
        population: '1.4 billion',
        language: 'Hindi, English'
    },
    'china': {
        coords: [35.8617, 104.1954],
        zoom: 4,
        name: 'China',
        info: 'The most populous country with ancient civilization, Great Wall, diverse landscapes, and modern megacities.',
        capital: 'Beijing',
        population: '1.4 billion',
        language: 'Mandarin'
    },
    'south-korea': {
        coords: [35.9078, 127.7669],
        zoom: 7,
        name: 'South Korea',
        info: 'An East Asian country known for K-pop, technology, delicious food, and blend of traditional and modern culture.',
        capital: 'Seoul',
        population: '52 million',
        language: 'Korean'
    },
    'mexico': {
        coords: [23.6345, -102.5528],
        zoom: 5,
        name: 'Mexico',
        info: 'A North American country famous for ancient Mayan and Aztec ruins, vibrant culture, and delicious cuisine.',
        capital: 'Mexico City',
        population: '129 million',
        language: 'Spanish'
    }
};

let map;
let currentMarker;
let totalViews = 0;
let countriesExplored = new Set();
let isDarkTheme = false;
let mapStyle = 'default';
let showMarkers = true;

window.addEventListener('load', () => {
    setupEventListeners();
    loadSettings();
});

function setupEventListeners() {
    document.getElementById('getStartedBtn').addEventListener('click', () => {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        initMap();
        loadStats();
    });

    document.getElementById('countrySelect').addEventListener('change', (e) => {
        updateMap(e.target.value);
    });

    document.getElementById('chatbotBtn').addEventListener('click', () => {
        document.getElementById('chatbotModal').style.display = 'flex';
    });

    document.getElementById('closeChatbot').addEventListener('click', () => {
        document.getElementById('chatbotModal').style.display = 'none';
    });

    document.getElementById('sendMessage').addEventListener('click', sendChatMessage);
    document.getElementById('chatbotInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'flex';
    });

    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').style.display = 'none';
    });

    document.getElementById('aboutBtn').addEventListener('click', () => {
        document.getElementById('aboutModal').style.display = 'flex';
    });

    document.getElementById('closeAbout').addEventListener('click', () => {
        document.getElementById('aboutModal').style.display = 'none';
    });

    document.getElementById('profileBtn').addEventListener('click', () => {
        updateProfileModal();
        document.getElementById('profileModal').style.display = 'flex';
    });

    document.getElementById('closeProfile').addEventListener('click', () => {
        document.getElementById('profileModal').style.display = 'none';
    });

    document.getElementById('themeToggle').addEventListener('change', (e) => {
        isDarkTheme = e.target.checked;
        applyTheme();
        saveSettings();
    });

    document.getElementById('autoCenterToggle').addEventListener('change', saveSettings);
    document.getElementById('showMarkersToggle').addEventListener('change', (e) => {
        showMarkers = e.target.checked;
        saveSettings();
    });

    document.getElementById('mapStyle').addEventListener('change', (e) => {
        mapStyle = e.target.value;
        updateMapStyle();
        saveSettings();
    });
}

function initMap() {
    if (!map) {
        map = L.map('map').setView([20, 0], 2);
        updateMapStyle();
    }
}

function updateMapStyle() {
    if (!map) return;
    
    map.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });

    let tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    
    if (mapStyle === 'satellite') {
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    } else if (mapStyle === 'terrain') {
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
    }

    L.tileLayer(tileUrl, {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
}

function updateMap(countryKey) {
    if (!countryKey || !map) return;
    
    const country = countries[countryKey];
    if (!country) return;
    
    map.setView(country.coords, country.zoom);
    
    if (currentMarker) {
        map.removeLayer(currentMarker);
    }
    
    if (showMarkers) {
        currentMarker = L.marker(country.coords).addTo(map)
            .bindPopup(`<b>${country.name}</b><br>${country.info}`)
            .openPopup();
    }
    
    document.getElementById('countryName').textContent = country.name;
    document.getElementById('countryInfo').textContent = country.info;
    document.getElementById('countryCapital').textContent = country.capital;
    document.getElementById('countryPopulation').textContent = country.population;
    document.getElementById('countryLanguage').textContent = country.language;
    
    totalViews++;
    countriesExplored.add(countryKey);
    
    updateStats();
    saveStats();
}

function updateStats() {
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('countriesExplored').textContent = countriesExplored.size;
}

function updateProfileModal() {
    document.getElementById('profileViews').textContent = totalViews;
    document.getElementById('profileCountries').textContent = countriesExplored.size;
    
    const level = Math.floor(countriesExplored.size / 3) + 1;
    document.getElementById('profileLevel').textContent = level;
    
    const badgesGrid = document.getElementById('badgesGrid');
    const badges = badgesGrid.querySelectorAll('.badge');
    
    if (countriesExplored.size >= 3) badges[0].classList.remove('locked');
    if (countriesExplored.size >= 7) badges[1].classList.remove('locked');
    if (countriesExplored.size >= 10) badges[2].classList.remove('locked');
    if (countriesExplored.size >= 15) badges[3].classList.remove('locked');
}

function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `<div class="message-bubble">${message}</div>`;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';
    
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble">${generateAIResponse(message)}</div>
        `;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1000);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('country') || lowerMessage.includes('explore')) {
        return 'You can explore 15 amazing countries! Just select one from the dropdown menu above the map.';
    } else if (lowerMessage.includes('feature') || lowerMessage.includes('how')) {
        return 'You can change map styles, toggle themes, view your profile, and track your exploration progress. Check the settings!';
    } else if (lowerMessage.includes('help')) {
        return 'I can help you explore countries, explain features, and answer questions about STARCOPE MAPS. What would you like to know?';
    } else if (lowerMessage.includes('stats') || lowerMessage.includes('progress')) {
        return `You've viewed ${totalViews} countries so far and explored ${countriesExplored.size} unique locations. Keep exploring!`;
    } else {
        return 'That\'s interesting! Feel free to explore the maps and discover new countries. Let me know if you need any help!';
    }
}

function applyTheme() {
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

function saveStats() {
    const stats = {
        totalViews: totalViews,
        countriesExplored: Array.from(countriesExplored)
    };
    localStorage.setItem('starcopeStats', JSON.stringify(stats));
}

function loadStats() {
    const saved = localStorage.getItem('starcopeStats');
    if (saved) {
        const stats = JSON.parse(saved);
        totalViews = stats.totalViews || 0;
        countriesExplored = new Set(stats.countriesExplored || []);
        updateStats();
    }
}

function saveSettings() {
    const settings = {
        isDarkTheme: isDarkTheme,
        mapStyle: mapStyle,
        showMarkers: showMarkers,
        autoCenter: document.getElementById('autoCenterToggle').checked
    };
    localStorage.setItem('starcopeSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('starcopeSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        isDarkTheme = settings.isDarkTheme || false;
        mapStyle = settings.mapStyle || 'default';
        showMarkers = settings.showMarkers !== false;
        
        document.getElementById('themeToggle').checked = isDarkTheme;
        document.getElementById('mapStyle').value = mapStyle;
        document.getElementById('showMarkersToggle').checked = showMarkers;
        document.getElementById('autoCenterToggle').checked = settings.autoCenter !== false;
        
        applyTheme();
    }
}
