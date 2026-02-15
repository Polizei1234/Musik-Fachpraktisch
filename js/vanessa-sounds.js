// Vanessa Mode Sound Effects

let vanessaModeActive = false;
let bgMusicPlaying = false;

// Check if Vanessa mode is active
function isVanessaMode() {
    return document.body.getAttribute('data-theme') === 'besch';
}

// Play background music on home screen
function playVanessaBgMusic() {
    if (!isVanessaMode()) return;
    
    const bgMusic = document.getElementById('vanessa-bg-music');
    if (!bgMusic) return;
    
    // Only play on welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen && welcomeScreen.classList.contains('active')) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(e => console.log('Background music failed:', e));
        bgMusicPlaying = true;
    }
}

// Stop background music
function stopVanessaBgMusic() {
    const bgMusic = document.getElementById('vanessa-bg-music');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusicPlaying = false;
    }
}

// Play clap sound for correct answer
function playVanessaCorrect() {
    if (!isVanessaMode()) return;
    
    const clapSound = document.getElementById('vanessa-correct');
    if (clapSound) {
        clapSound.volume = 0.5;
        clapSound.currentTime = 0;
        clapSound.play().catch(e => console.log('Clap sound failed:', e));
    }
}

// Play boo sound for wrong answer
function playVanessaWrong() {
    if (!isVanessaMode()) return;
    
    const booSound = document.getElementById('vanessa-wrong');
    if (booSound) {
        booSound.volume = 0.5;
        booSound.currentTime = 0;
        booSound.play().catch(e => console.log('Boo sound failed:', e));
    }
}

// Monitor theme changes
const originalSetTheme = window.setTheme;
window.setTheme = function(theme) {
    originalSetTheme(theme);
    
    if (theme === 'besch') {
        vanessaModeActive = true;
        setTimeout(() => playVanessaBgMusic(), 500);
    } else {
        vanessaModeActive = false;
        stopVanessaBgMusic();
    }
};

// Monitor screen changes to control background music
const originalStartExercise = window.startExercise;
window.startExercise = function(type) {
    stopVanessaBgMusic();
    if (originalStartExercise) originalStartExercise(type);
};

const originalGoHome = window.goHome;
window.goHome = function() {
    if (originalGoHome) originalGoHome();
    setTimeout(() => playVanessaBgMusic(), 300);
};

// Start background music on load if Vanessa mode is active
window.addEventListener('load', () => {
    if (isVanessaMode()) {
        vanessaModeActive = true;
        // Wait for user interaction before playing
        document.body.addEventListener('click', () => {
            if (!bgMusicPlaying) {
                playVanessaBgMusic();
            }
        }, { once: true });
    }
});