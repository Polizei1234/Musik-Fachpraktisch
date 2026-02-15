// Theme Management with localStorage
function setTheme(theme) {
    // Set theme attribute
    document.body.setAttribute('data-theme', theme);
    
    // Save to localStorage
    localStorage.setItem('music-trainer-theme', theme);
    
    // Visual feedback - highlight active theme
    updateActiveTheme(theme);
    
    console.log('Theme set to:', theme);
}

function updateActiveTheme(theme) {
    // Remove active class from all theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected theme button
    const activeBtn = Array.from(document.querySelectorAll('.theme-btn')).find(btn => {
        return btn.getAttribute('onclick').includes(`'${theme}'`);
    });
    
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function loadTheme() {
    // Load theme from localStorage or use default
    const savedTheme = localStorage.getItem('music-trainer-theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    console.log('Theme loaded:', savedTheme);
    
    // Update active state after a short delay to ensure DOM is ready
    setTimeout(() => updateActiveTheme(savedTheme), 100);
}

function openSettings() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('settings-screen').classList.add('active');
    
    // Update active theme when opening settings
    const currentTheme = document.body.getAttribute('data-theme') || 'dark';
    updateActiveTheme(currentTheme);
}

// Load theme immediately when script loads
loadTheme();

// Also load on window load as backup
window.addEventListener('load', loadTheme);

// Load theme on DOMContentLoaded
window.addEventListener('DOMContentLoaded', loadTheme);