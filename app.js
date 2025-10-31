
const countries = {
    'philippines': {
        coords: [12.8797, 121.7740],
        zoom: 6,
        name: 'Philippines',
        info: 'An archipelagic country in Southeast Asia with over 7,000 islands. Known for beautiful beaches, rich culture, and friendly people.'
    },
    'japan': {
        coords: [36.2048, 138.2529],
        zoom: 5,
        name: 'Japan',
        info: 'An island nation in East Asia known for its ancient temples, modern technology, cherry blossoms, and rich cultural heritage.'
    },
    'usa': {
        coords: [37.0902, -95.7129],
        zoom: 4,
        name: 'United States',
        info: 'A large country in North America known for its diverse landscapes, major cities, and cultural influence worldwide.'
    },
    'uk': {
        coords: [55.3781, -3.4360],
        zoom: 6,
        name: 'United Kingdom',
        info: 'An island nation in Northwestern Europe comprising England, Scotland, Wales, and Northern Ireland. Rich in history and culture.'
    },
    'france': {
        coords: [46.2276, 2.2137],
        zoom: 6,
        name: 'France',
        info: 'A Western European country famous for its art, cuisine, fashion, and iconic landmarks like the Eiffel Tower.'
    },
    'germany': {
        coords: [51.1657, 10.4515],
        zoom: 6,
        name: 'Germany',
        info: 'A Central European country known for its engineering, automotive industry, rich history, and beautiful castles.'
    },
    'italy': {
        coords: [41.8719, 12.5674],
        zoom: 6,
        name: 'Italy',
        info: 'A Southern European country famous for its ancient history, art, architecture, and world-renowned cuisine.'
    },
    'spain': {
        coords: [40.4637, -3.7492],
        zoom: 6,
        name: 'Spain',
        info: 'A vibrant country in Southern Europe known for its diverse culture, flamenco dancing, and beautiful beaches.'
    },
    'canada': {
        coords: [56.1304, -106.3468],
        zoom: 4,
        name: 'Canada',
        info: 'The second-largest country in the world, known for its vast wilderness, multicultural cities, and friendly people.'
    },
    'australia': {
        coords: [-25.2744, 133.7751],
        zoom: 4,
        name: 'Australia',
        info: 'A country and continent surrounded by ocean, famous for unique wildlife, beaches, and the Great Barrier Reef.'
    },
    'brazil': {
        coords: [-14.2350, -51.9253],
        zoom: 4,
        name: 'Brazil',
        info: 'The largest country in South America, known for Amazon rainforest, Carnival festival, and soccer culture.'
    },
    'india': {
        coords: [20.5937, 78.9629],
        zoom: 5,
        name: 'India',
        info: 'A South Asian country known for its diverse culture, ancient history, spiritual heritage, and spicy cuisine.'
    },
    'china': {
        coords: [35.8617, 104.1954],
        zoom: 4,
        name: 'China',
        info: 'The most populous country with ancient civilization, Great Wall, diverse landscapes, and modern megacities.'
    },
    'south-korea': {
        coords: [35.9078, 127.7669],
        zoom: 7,
        name: 'South Korea',
        info: 'An East Asian country known for K-pop, technology, delicious food, and blend of traditional and modern culture.'
    },
    'mexico': {
        coords: [23.6345, -102.5528],
        zoom: 5,
        name: 'Mexico',
        info: 'A North American country famous for ancient Mayan and Aztec ruins, vibrant culture, and delicious cuisine.'
    }
};

let map;
let totalViews = 0;
let countriesExplored = new Set();

// Admin password
const ADMIN_PASSWORD = '1989';

// Initialize app on load
window.addEventListener('load', () => {
    checkAppStatus();
    setupEventListeners();
});

function checkAppStatus() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            if (data.maintenance) {
                showMaintenanceScreen();
            } else if (data.down) {
                showDownScreen();
            } else {
                // Show welcome screen by default
                document.getElementById('welcomeScreen').style.display = 'flex';
            }
        })
        .catch(err => {
            console.log('Failed to check status:', err);
            document.getElementById('welcomeScreen').style.display = 'flex';
        });
}

function setupEventListeners() {
    // Get Started Button
    document.getElementById('getStartedBtn').addEventListener('click', () => {
        document.getElementById('welcomeScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        initMap();
        loadStats();
    });

    // Admin Button
    document.getElementById('adminBtn').addEventListener('click', () => {
        document.getElementById('adminLogin').style.display = 'flex';
    });

    // Login Button
    document.getElementById('loginBtn').addEventListener('click', () => {
        const password = document.getElementById('adminPassword').value;
        if (password === ADMIN_PASSWORD) {
            document.getElementById('adminLogin').style.display = 'none';
            document.getElementById('adminDashboard').style.display = 'block';
            loadAdminSettings();
        } else {
            document.getElementById('loginError').style.display = 'block';
        }
    });

    // Cancel Login
    document.getElementById('cancelLoginBtn').addEventListener('click', () => {
        document.getElementById('adminLogin').style.display = 'none';
        document.getElementById('adminPassword').value = '';
        document.getElementById('loginError').style.display = 'none';
    });

    // Close Admin Dashboard
    document.getElementById('closeAdminBtn').addEventListener('click', () => {
        document.getElementById('adminDashboard').style.display = 'none';
    });

    // Maintenance Toggle
    document.getElementById('maintenanceToggle').addEventListener('change', (e) => {
        updateAppStatus('maintenance', e.target.checked);
    });

    // Down Toggle
    document.getElementById('downToggle').addEventListener('change', (e) => {
        updateAppStatus('down', e.target.checked);
    });

    // Country Select
    document.getElementById('countrySelect').addEventListener('change', (e) => {
        updateMap(e.target.value);
    });
}

function loadAdminSettings() {
    fetch('/api/status')
        .then(response => response.json())
        .then(data => {
            document.getElementById('maintenanceToggle').checked = data.maintenance || false;
            document.getElementById('downToggle').checked = data.down || false;
        })
        .catch(err => console.log('Failed to load admin settings:', err));
}

function updateAppStatus(type, value) {
    fetch('/api/status', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ [type]: value })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            if (data.maintenance) {
                showMaintenanceScreen();
            } else if (data.down) {
                showDownScreen();
            } else {
                hideStatusScreens();
            }
        }
    })
    .catch(err => console.log('Failed to update status:', err));
}

function showMaintenanceScreen() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('downScreen').style.display = 'none';
    document.getElementById('maintenanceScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDownScreen() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('maintenanceScreen').style.display = 'none';
    document.getElementById('downScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function hideStatusScreens() {
    document.getElementById('maintenanceScreen').style.display = 'none';
    document.getElementById('downScreen').style.display = 'none';
}

function initMap() {
    if (!map) {
        map = L.map('map').setView([20, 0], 2);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);
    }
}

function updateMap(countryKey) {
    if (!countryKey || !map) return;
    
    const country = countries[countryKey];
    if (!country) return;
    
    map.setView(country.coords, country.zoom);
    
    L.marker(country.coords).addTo(map)
        .bindPopup(`<b>${country.name}</b><br>${country.info}`)
        .openPopup();
    
    document.getElementById('countryName').textContent = country.name;
    document.getElementById('countryInfo').textContent = country.info;
    
    totalViews++;
    countriesExplored.add(countryKey);
    
    updateStats();
    saveStats();
}

function updateStats() {
    document.getElementById('totalViews').textContent = totalViews;
    document.getElementById('countriesExplored').textContent = countriesExplored.size;
}

function saveStats() {
    const stats = {
        totalViews: totalViews,
        countriesExplored: Array.from(countriesExplored)
    };
    
    fetch('/api/stats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stats)
    }).catch(err => console.log('Failed to save stats:', err));
}

function loadStats() {
    fetch('/api/stats')
        .then(response => response.json())
        .then(data => {
            totalViews = data.totalViews || 0;
            countriesExplored = new Set(data.countriesExplored || []);
            updateStats();
        })
        .catch(err => console.log('Failed to load stats:', err));
}
