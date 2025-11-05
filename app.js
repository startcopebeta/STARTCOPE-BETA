
const GEMINI_API_URL = 'https://betadash-api-swordslush-production.up.railway.app/gemini';
const USER_ID = '61580959514473';
const PHIVOLCS_API_URL = 'https://betadash-api-swordslush-production.up.railway.app/phivolcs';

let earthquakeData = [];
let showEarthquakes = false;
let earthquakeMarkers = [];
let weatherData = null;
let showWeather = false;
let showTraffic = false;
let phivolcsData = null;
let showPhivolcs = false;
let phivolcsMarkers = [];

const countries = {
    'philippines': {
        coords: [12.8797, 121.7740],
        zoom: 6,
        name: 'Philippines',
        info: 'An archipelagic country in Southeast Asia with over 7,000 islands. Known for beautiful beaches, rich culture, and friendly people.',
        capital: 'Manila',
        population: '113 million',
        language: 'Filipino, English',
        currency: 'PHP',
        timezone: 'GMT+8',
        area: '300,000 km²'
    },
    'japan': {
        coords: [36.2048, 138.2529],
        zoom: 5,
        name: 'Japan',
        info: 'An island nation in East Asia known for its ancient temples, modern technology, cherry blossoms, and rich cultural heritage.',
        capital: 'Tokyo',
        population: '125 million',
        language: 'Japanese',
        currency: 'JPY',
        timezone: 'GMT+9',
        area: '377,975 km²'
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
        language: 'Spanish',
        currency: 'MXN',
        timezone: 'GMT-6',
        area: '1,964,375 km²'
    },
    'russia': {
        coords: [61.5240, 105.3188],
        zoom: 3,
        name: 'Russia',
        info: 'The largest country in the world, spanning Eastern Europe and Northern Asia.',
        capital: 'Moscow',
        population: '146 million',
        language: 'Russian',
        currency: 'RUB',
        timezone: 'Multiple',
        area: '17,098,242 km²'
    },
    'thailand': {
        coords: [15.8700, 100.9925],
        zoom: 6,
        name: 'Thailand',
        info: 'Known for tropical beaches, royal palaces, ancient ruins, and ornate temples.',
        capital: 'Bangkok',
        population: '70 million',
        language: 'Thai',
        currency: 'THB',
        timezone: 'GMT+7',
        area: '513,120 km²'
    },
    'singapore': {
        coords: [1.3521, 103.8198],
        zoom: 11,
        name: 'Singapore',
        info: 'A global financial hub with a tropical climate and multicultural population.',
        capital: 'Singapore',
        population: '5.9 million',
        language: 'English, Malay, Mandarin, Tamil',
        currency: 'SGD',
        timezone: 'GMT+8',
        area: '728.6 km²'
    },
    'vietnam': {
        coords: [14.0583, 108.2772],
        zoom: 6,
        name: 'Vietnam',
        info: 'Known for beaches, rivers, Buddhist pagodas, and bustling cities.',
        capital: 'Hanoi',
        population: '98 million',
        language: 'Vietnamese',
        currency: 'VND',
        timezone: 'GMT+7',
        area: '331,212 km²'
    },
    'indonesia': {
        coords: [-0.7893, 113.9213],
        zoom: 5,
        name: 'Indonesia',
        info: 'An archipelagic country with thousands of volcanic islands.',
        capital: 'Jakarta',
        population: '276 million',
        language: 'Indonesian',
        currency: 'IDR',
        timezone: 'GMT+7 to GMT+9',
        area: '1,904,569 km²'
    },
    'malaysia': {
        coords: [4.2105, 101.9758],
        zoom: 6,
        name: 'Malaysia',
        info: 'Known for beaches, rainforests, and mix of Malay, Chinese, Indian and European influences.',
        capital: 'Kuala Lumpur',
        population: '33 million',
        language: 'Malay',
        currency: 'MYR',
        timezone: 'GMT+8',
        area: '330,803 km²'
    },
    'new-zealand': {
        coords: [-40.9006, 174.8860],
        zoom: 6,
        name: 'New Zealand',
        info: 'Known for stunning natural landscapes, from mountains to beaches.',
        capital: 'Wellington',
        population: '5.1 million',
        language: 'English, Māori',
        currency: 'NZD',
        timezone: 'GMT+12',
        area: '268,021 km²'
    },
    'argentina': {
        coords: [-38.4161, -63.6167],
        zoom: 4,
        name: 'Argentina',
        info: 'Known for tango, beef, wine, and diverse landscapes from Andes to Patagonia.',
        capital: 'Buenos Aires',
        population: '45 million',
        language: 'Spanish',
        currency: 'ARS',
        timezone: 'GMT-3',
        area: '2,780,400 km²'
    },
    'egypt': {
        coords: [26.8206, 30.8025],
        zoom: 6,
        name: 'Egypt',
        info: 'Home to ancient pyramids, the Nile River, and thousands of years of history.',
        capital: 'Cairo',
        population: '104 million',
        language: 'Arabic',
        currency: 'EGP',
        timezone: 'GMT+2',
        area: '1,002,450 km²'
    },
    'south-africa': {
        coords: [-30.5595, 22.9375],
        zoom: 5,
        name: 'South Africa',
        info: 'Known for diverse ecosystems, wildlife, and cultural heritage.',
        capital: 'Pretoria',
        population: '60 million',
        language: '11 official languages',
        currency: 'ZAR',
        timezone: 'GMT+2',
        area: '1,221,037 km²'
    },
    'turkey': {
        coords: [38.9637, 35.2433],
        zoom: 6,
        name: 'Turkey',
        info: 'A transcontinental country bridging Europe and Asia.',
        capital: 'Ankara',
        population: '85 million',
        language: 'Turkish',
        currency: 'TRY',
        timezone: 'GMT+3',
        area: '783,562 km²'
    },
    'greece': {
        coords: [39.0742, 21.8243],
        zoom: 6,
        name: 'Greece',
        info: 'Birthplace of Western civilization, known for ancient ruins and islands.',
        capital: 'Athens',
        population: '10.4 million',
        language: 'Greek',
        currency: 'EUR',
        timezone: 'GMT+2',
        area: '131,957 km²'
    },
    'portugal': {
        coords: [39.3999, -8.2245],
        zoom: 7,
        name: 'Portugal',
        info: 'Known for port wine, beaches, and rich maritime history.',
        capital: 'Lisbon',
        population: '10.3 million',
        language: 'Portuguese',
        currency: 'EUR',
        timezone: 'GMT+0',
        area: '92,212 km²'
    },
    'netherlands': {
        coords: [52.1326, 5.2913],
        zoom: 7,
        name: 'Netherlands',
        info: 'Known for windmills, tulips, and extensive canal systems.',
        capital: 'Amsterdam',
        population: '17.5 million',
        language: 'Dutch',
        currency: 'EUR',
        timezone: 'GMT+1',
        area: '41,543 km²'
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
        loadEarthquakeData();
        loadPhivolcsData();
    });

    document.getElementById('countrySelect').addEventListener('change', (e) => {
        updateMap(e.target.value);
    });

    document.getElementById('searchCountry').addEventListener('input', (e) => {
        filterCountries(e.target.value);
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

    document.getElementById('earthquakeToggle').addEventListener('change', (e) => {
        showEarthquakes = e.target.checked;
        toggleEarthquakes();
        saveSettings();
    });

    document.getElementById('weatherToggle').addEventListener('change', (e) => {
        showWeather = e.target.checked;
        saveSettings();
    });

    document.getElementById('trafficToggle').addEventListener('change', (e) => {
        showTraffic = e.target.checked;
        saveSettings();
    });

    document.getElementById('3dToggle').addEventListener('change', saveSettings);
    document.getElementById('satelliteToggle').addEventListener('change', (e) => {
        if (e.target.checked) {
            document.getElementById('mapStyle').value = 'satellite';
            mapStyle = 'satellite';
            updateMapStyle();
        }
        saveSettings();
    });

    document.getElementById('phivolcsToggle').addEventListener('change', (e) => {
        showPhivolcs = e.target.checked;
        togglePhivolcs();
        saveSettings();
    });

    document.getElementById('installApkBtn').addEventListener('click', () => {
        const apkUrl = 'https://starcope-mobile.apk'; // Replace with actual APK URL
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = 'STAR_MOBILE_APK.apk';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('📱 STAR MOBILE APK download started!\n\nNote: Make sure to enable "Install from Unknown Sources" in your Android settings before installing.');
    });

    document.getElementById('dashboardBtn').addEventListener('click', () => {
        window.location.href = 'dashboard.html';
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
    document.getElementById('countryCurrency').textContent = country.currency || '-';
    document.getElementById('countryTimezone').textContent = country.timezone || '-';
    document.getElementById('countryArea').textContent = country.area || '-';
    
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

async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const messagesContainer = document.getElementById('chatbotMessages');
    
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.innerHTML = `
        <div class="message-avatar-user">👤</div>
        <div class="message-bubble">${escapeHtml(message)}</div>
    `;
    messagesContainer.appendChild(userMessage);
    
    input.value = '';
    
    const loadingMessage = document.createElement('div');
    loadingMessage.className = 'bot-message';
    loadingMessage.id = 'loading-message';
    loadingMessage.innerHTML = `
        <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
        <div class="message-bubble typing-indicator">
            <span></span><span></span><span></span>
        </div>
    `;
    messagesContainer.appendChild(loadingMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Check if message is an image generation request
    const imageCommands = ['/poli', '/generate', '/image', '/img'];
    const isImageRequest = imageCommands.some(cmd => message.toLowerCase().startsWith(cmd));
    
    if (isImageRequest) {
        await generateImage(message, messagesContainer);
        return;
    }
    
    try {
        const response = await fetch(`${GEMINI_API_URL}?ask=${encodeURIComponent(message)}`);
        const data = await response.json();
        
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) loadingEl.remove();
        
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble">${escapeHtml(data.response || 'Sorry, I could not process that.')}</div>
        `;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        const loadingEl = document.getElementById('loading-message');
        if (loadingEl) loadingEl.remove();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot-message';
        errorMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble">I'm having trouble connecting right now. Please try again later.</div>
        `;
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

async function generateImage(message, messagesContainer) {
    const loadingEl = document.getElementById('loading-message');
    
    // Extract prompt from command
    const prompt = message.replace(/^\/(?:poli|generate|image|img)\s*/i, '').trim();
    
    if (!prompt) {
        if (loadingEl) loadingEl.remove();
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot-message';
        errorMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble">Please provide a description for the image you want to generate.<br><br>Example: <code>/poli a beautiful sunset over mountains</code></div>
        `;
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        return;
    }
    
    try {
        // Update loading message
        if (loadingEl) {
            loadingEl.innerHTML = `
                <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
                <div class="message-bubble">🎨 Generating image: "${prompt}"...</div>
            `;
        }
        
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`;
        
        // Wait a bit for the image to be generated
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        if (loadingEl) loadingEl.remove();
        
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble image-message">
                <div class="image-caption">✨ Generated Image</div>
                <img src="${imageUrl}" alt="Generated: ${escapeHtml(prompt)}" class="generated-image" loading="lazy">
                <div class="image-actions">
                    <button class="image-action-btn" onclick="downloadImage('${imageUrl}', '${escapeHtml(prompt)}')">⬇️ Download</button>
                    <button class="image-action-btn" onclick="window.open('${imageUrl}', '_blank')">🔍 View Full</button>
                </div>
            </div>
        `;
        messagesContainer.appendChild(botMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
    } catch (error) {
        if (loadingEl) loadingEl.remove();
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'bot-message';
        errorMessage.innerHTML = `
            <img src="https://i.ibb.co/V4W1p7M/profile.png" alt="AI" class="message-avatar">
            <div class="message-bubble">❌ Failed to generate image. Please try again.</div>
        `;
        messagesContainer.appendChild(errorMessage);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function downloadImage(url, prompt) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prompt.substring(0, 30).replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function loadEarthquakeData() {
    try {
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson');
        const data = await response.json();
        earthquakeData = data.features;
        if (showEarthquakes) {
            displayEarthquakes();
        }
    } catch (error) {
        console.log('Could not load earthquake data');
    }
}

function toggleEarthquakes() {
    if (showEarthquakes) {
        displayEarthquakes();
    } else {
        clearEarthquakes();
    }
}

function displayEarthquakes() {
    if (!map) return;
    clearEarthquakes();
    
    earthquakeData.forEach(quake => {
        const coords = quake.geometry.coordinates;
        const mag = quake.properties.mag;
        const place = quake.properties.place;
        
        if (mag && coords) {
            const marker = L.circleMarker([coords[1], coords[0]], {
                radius: mag * 3,
                fillColor: mag >= 5 ? '#ff0000' : mag >= 3 ? '#ff9900' : '#ffff00',
                color: '#000',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.6
            }).addTo(map);
            
            marker.bindPopup(`<b>Magnitude ${mag}</b><br>${place}`);
            earthquakeMarkers.push(marker);
        }
    });
}

function clearEarthquakes() {
    earthquakeMarkers.forEach(marker => map.removeLayer(marker));
    earthquakeMarkers = [];
}

async function loadPhivolcsData() {
    try {
        const response = await fetch(`${PHIVOLCS_API_URL}?info=Philippines`);
        const data = await response.json();
        phivolcsData = data;
        if (showPhivolcs) {
            displayPhivolcs();
        }
    } catch (error) {
        console.log('Could not load PHIVOLCS data');
    }
}

function togglePhivolcs() {
    if (showPhivolcs) {
        displayPhivolcs();
    } else {
        clearPhivolcs();
    }
}

function displayPhivolcs() {
    if (!map || !phivolcsData) return;
    clearPhivolcs();
    
    if (phivolcsData.volcanoes && Array.isArray(phivolcsData.volcanoes)) {
        phivolcsData.volcanoes.forEach(volcano => {
            if (volcano.latitude && volcano.longitude) {
                const marker = L.marker([volcano.latitude, volcano.longitude], {
                    icon: L.divIcon({
                        className: 'volcano-marker',
                        html: '🌋',
                        iconSize: [30, 30]
                    })
                }).addTo(map);
                
                marker.bindPopup(`
                    <b>🌋 ${volcano.name || 'Volcano'}</b><br>
                    Alert Level: ${volcano.alert_level || 'N/A'}<br>
                    Status: ${volcano.status || 'N/A'}<br>
                    Location: ${volcano.location || 'N/A'}
                `);
                phivolcsMarkers.push(marker);
            }
        });
    }
    
    if (phivolcsData.earthquakes && Array.isArray(phivolcsData.earthquakes)) {
        phivolcsData.earthquakes.forEach(quake => {
            if (quake.latitude && quake.longitude) {
                const mag = parseFloat(quake.magnitude) || 0;
                const marker = L.circleMarker([quake.latitude, quake.longitude], {
                    radius: mag * 4,
                    fillColor: '#ff6b6b',
                    color: '#c92a2a',
                    weight: 2,
                    opacity: 1,
                    fillOpacity: 0.7
                }).addTo(map);
                
                marker.bindPopup(`
                    <b>📍 Earthquake</b><br>
                    Magnitude: ${quake.magnitude || 'N/A'}<br>
                    Depth: ${quake.depth || 'N/A'}<br>
                    Location: ${quake.location || 'N/A'}<br>
                    Time: ${quake.time || 'N/A'}
                `);
                phivolcsMarkers.push(marker);
            }
        });
    }
}

function clearPhivolcs() {
    phivolcsMarkers.forEach(marker => map.removeLayer(marker));
    phivolcsMarkers = [];
}

function filterCountries(searchTerm) {
    const select = document.getElementById('countrySelect');
    const options = select.querySelectorAll('option');
    
    options.forEach(option => {
        if (option.value === '') return;
        const countryName = option.textContent.toLowerCase();
        if (countryName.includes(searchTerm.toLowerCase())) {
            option.style.display = '';
        } else {
            option.style.display = 'none';
        }
    });
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
        autoCenter: document.getElementById('autoCenterToggle').checked,
        showEarthquakes: showEarthquakes,
        showWeather: showWeather,
        showTraffic: showTraffic,
        showPhivolcs: showPhivolcs
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
        showEarthquakes = settings.showEarthquakes || false;
        showWeather = settings.showWeather || false;
        showTraffic = settings.showTraffic || false;
        showPhivolcs = settings.showPhivolcs || false;
        
        document.getElementById('themeToggle').checked = isDarkTheme;
        document.getElementById('mapStyle').value = mapStyle;
        document.getElementById('showMarkersToggle').checked = showMarkers;
        document.getElementById('autoCenterToggle').checked = settings.autoCenter !== false;
        document.getElementById('earthquakeToggle').checked = showEarthquakes;
        document.getElementById('weatherToggle').checked = showWeather;
        document.getElementById('trafficToggle').checked = showTraffic;
        document.getElementById('phivolcsToggle').checked = showPhivolcs;
        
        applyTheme();
    }
}
