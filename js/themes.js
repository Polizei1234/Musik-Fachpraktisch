// Theme Management
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Visual feedback
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        btn.style.transform = '';
    });
    
    // Animate selected button
    event.target.closest('.theme-btn').style.transform = 'scale(1.1)';
    setTimeout(() => {
        event.target.closest('.theme-btn').style.transform = '';
    }, 200);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
}

function openSettings() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('settings-screen').classList.add('active');
}

// Load theme on startup
window.addEventListener('load', loadTheme);