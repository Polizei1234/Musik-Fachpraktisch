// Vanessa Mode Sound Effects

let vanessaModeActive = false;
let bgMusicPlaying = false;
let audioUnlockedForVanessa = false;

// Check if Vanessa mode is active
function isVanessaMode() {
    return document.body.getAttribute('data-theme') === 'besch';
}

// Unlock audio on first user interaction
function unlockVanessaAudio() {
    if (audioUnlockedForVanessa) return;
    
    const bgMusic = document.getElementById('vanessa-bg-music');
    const clap = document.getElementById('vanessa-correct');
    const boo = document.getElementById('vanessa-wrong');
    
    if (bgMusic) {
        bgMusic.load();
        bgMusic.volume = 0.3;
    }
    if (clap) {
        clap.load();
        clap.volume = 0.5;
    }
    if (boo) {
        boo.load();
        boo.volume = 0.5;
    }
    
    audioUnlockedForVanessa = true;
    console.log('Vanessa audio unlocked!');
}

// Play background music on home screen
function playVanessaBgMusic() {
    if (!isVanessaMode()) return;
    
    unlockVanessaAudio();
    
    const bgMusic = document.getElementById('vanessa-bg-music');
    if (!bgMusic) {
        console.log('Background music element not found');
        return;
    }
    
    // Only play on welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen && welcomeScreen.classList.contains('active')) {
        bgMusic.play().then(() => {
            bgMusicPlaying = true;
            console.log('Background music playing');
        }).catch(e => {
            console.log('Background music play failed:', e.message);
            // Retry after user clicks anywhere
            document.body.addEventListener('click', () => {
                bgMusic.play().then(() => {
                    bgMusicPlaying = true;
                    console.log('Background music playing after click');
                }).catch(err => console.log('Still failed:', err.message));
            }, { once: true });
        });
    }
}

// Stop background music
function stopVanessaBgMusic() {
    const bgMusic = document.getElementById('vanessa-bg-music');
    if (bgMusic) {
        bgMusic.pause();
        bgMusic.currentTime = 0;
        bgMusicPlaying = false;
        console.log('Background music stopped');
    }
}

// Play clap sound for correct answer
function playVanessaCorrect() {
    if (!isVanessaMode()) return;
    
    unlockVanessaAudio();
    
    const clapSound = document.getElementById('vanessa-correct');
    if (clapSound) {
        clapSound.currentTime = 0;
        clapSound.play().then(() => {
            console.log('Clap sound played');
        }).catch(e => {
            console.log('Clap sound failed:', e.message);
        });
    } else {
        console.log('Clap sound element not found');
    }
}

// Play boo sound for wrong answer
function playVanessaWrong() {
    if (!isVanessaMode()) return;
    
    unlockVanessaAudio();
    
    const booSound = document.getElementById('vanessa-wrong');
    if (booSound) {
        booSound.currentTime = 0;
        booSound.play().then(() => {
            console.log('Boo sound played');
        }).catch(e => {
            console.log('Boo sound failed:', e.message);
        });
    } else {
        console.log('Boo sound element not found');
    }
}

// Monitor theme changes
window.addEventListener('load', () => {
    const originalSetTheme = window.setTheme;
    if (originalSetTheme) {
        window.setTheme = function(theme) {
            originalSetTheme(theme);
            
            if (theme === 'besch') {
                vanessaModeActive = true;
                console.log('Vanessa mode activated');
                setTimeout(() => {
                    unlockVanessaAudio();
                    playVanessaBgMusic();
                }, 500);
            } else {
                vanessaModeActive = false;
                stopVanessaBgMusic();
            }
        };
    }
    
    const originalStartExercise = window.startExercise;
    if (originalStartExercise) {
        window.startExercise = function(type) {
            stopVanessaBgMusic();
            originalStartExercise(type);
        };
    }
    
    const originalGoHome = window.goHome;
    if (originalGoHome) {
        window.goHome = function() {
            originalGoHome();
            setTimeout(() => playVanessaBgMusic(), 300);
        };
    }
    
    // Check if Vanessa mode on load
    if (isVanessaMode()) {
        vanessaModeActive = true;
        console.log('Vanessa mode active on load');
        
        // Unlock audio on first click
        document.body.addEventListener('click', () => {
            unlockVanessaAudio();
            playVanessaBgMusic();
        }, { once: true });
    }
});

// Preload audio when page loads
window.addEventListener('DOMContentLoaded', () => {
    const bgMusic = document.getElementById('vanessa-bg-music');
    const clap = document.getElementById('vanessa-correct');
    const boo = document.getElementById('vanessa-wrong');
    
    if (bgMusic) bgMusic.preload = 'auto';
    if (clap) clap.preload = 'auto';
    if (boo) boo.preload = 'auto';
    
    console.log('Vanessa audio elements preloaded');
});