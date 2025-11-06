const radioStations = [
    {
        id: 1,
        name: "Brigada News FM Manila",
        frequency: "FM 99.5",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Metro Manila",
        category: "Brigada News FM",
        description: "Ang Tinig ng Bayan - News and Public Affairs"
    },
    {
        id: 2,
        name: "Brigada News FM Cebu",
        frequency: "FM 100.3",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Cebu City",
        category: "Brigada News FM",
        description: "Brigada News FM Cebu Station"
    },
    {
        id: 3,
        name: "Brigada News FM Davao",
        frequency: "FM 94.7",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Davao City",
        category: "Brigada News FM",
        description: "Brigada News FM Davao Station"
    },
    {
        id: 4,
        name: "Brigada News FM Baguio",
        frequency: "FM 92.9",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Baguio City",
        category: "Brigada News FM",
        description: "Brigada News FM Baguio Station"
    },
    {
        id: 5,
        name: "Brigada News FM Iloilo",
        frequency: "FM 98.1",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Iloilo City",
        category: "Brigada News FM",
        description: "Brigada News FM Iloilo Station"
    },
    {
        id: 6,
        name: "Energy FM 91.5",
        frequency: "FM 91.5",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "⚡",
        location: "Metro Manila",
        category: "Music",
        description: "The Rhythm of the City - Hit Music Station"
    },
    {
        id: 7,
        name: "OK FM 97.1",
        frequency: "FM 97.1",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "👌",
        location: "Metro Manila",
        category: "OPM",
        description: "Original Pilipino Music Station"
    },
    {
        id: 8,
        name: "DWRR 101.9",
        frequency: "FM 101.9",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "🎵",
        location: "Metro Manila",
        category: "Music",
        description: "Classic and Contemporary Hits"
    },
    {
        id: 9,
        name: "DZRH 666 kHz",
        frequency: "AM 666",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📡",
        location: "Metro Manila",
        category: "News",
        description: "News and Public Affairs"
    },
    {
        id: 10,
        name: "DZMM 630 kHz",
        frequency: "AM 630",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📡",
        location: "Metro Manila",
        category: "News",
        description: "Teleradyo - News and Current Affairs"
    },
    {
        id: 11,
        name: "Love Radio Manila 90.7",
        frequency: "FM 90.7",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "❤️",
        location: "Metro Manila",
        category: "Music",
        description: "Love Song Dedications and Entertainment"
    },
    {
        id: 12,
        name: "Magic 89.9",
        frequency: "FM 89.9",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "✨",
        location: "Metro Manila",
        category: "Music",
        description: "The Home of Alternative Music"
    },
    {
        id: 13,
        name: "DWIZ 882 kHz",
        frequency: "AM 882",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📡",
        location: "Metro Manila",
        category: "News",
        description: "News and Commentary"
    },
    {
        id: 14,
        name: "MOR 101.9",
        frequency: "FM 101.9",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "🎼",
        location: "Metro Manila",
        category: "Music",
        description: "My Only Radio - OPM and Love Songs"
    },
    {
        id: 15,
        name: "RX 93.1",
        frequency: "FM 93.1",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "🎙️",
        location: "Metro Manila",
        category: "Music",
        description: "Monster Radio - Rock and Alternative"
    },
    {
        id: 16,
        name: "Yes FM 101.1",
        frequency: "FM 101.1",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "✅",
        location: "Metro Manila",
        category: "Music",
        description: "The Best Music"
    },
    {
        id: 17,
        name: "DZBB 594 kHz",
        frequency: "AM 594",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📡",
        location: "Metro Manila",
        category: "News",
        description: "Radyo Barangay - Community News"
    },
    {
        id: 18,
        name: "Star FM 100.7",
        frequency: "FM 100.7",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "⭐",
        location: "Cebu City",
        category: "Music",
        description: "Cebu's Hit Music Station"
    },
    {
        id: 19,
        name: "DYHP 95.5",
        frequency: "FM 95.5",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Cebu City",
        category: "News",
        description: "Cebu News and Public Affairs"
    },
    {
        id: 20,
        name: "Bombo Radyo Cebu",
        frequency: "AM 1125",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "💥",
        location: "Cebu City",
        category: "News",
        description: "Cebu News and Commentary"
    },
    {
        id: 21,
        name: "DXRR 93.1",
        frequency: "FM 93.1",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "🎵",
        location: "Davao City",
        category: "Music",
        description: "Davao's Music Station"
    },
    {
        id: 22,
        name: "DXUM 99.5",
        frequency: "FM 99.5",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "📻",
        location: "Davao City",
        category: "News",
        description: "Davao News and Information"
    },
    {
        id: 23,
        name: "Bombo Radyo Davao",
        frequency: "AM 1170",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "💥",
        location: "Davao City",
        category: "News",
        description: "Davao News and Current Affairs"
    },
    {
        id: 24,
        name: "DYOK 89.7",
        frequency: "FM 89.7",
        stream: "https://streams.radio.co/s83e4c7d3d/listen",
        logo: "👌",
        location: "Iloilo City",
        category: "OPM",
        description: "Iloilo OPM Station"
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { radioStations };
}
