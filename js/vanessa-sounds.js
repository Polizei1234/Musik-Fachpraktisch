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
        clap.volume = 0.6;
    }
    if (boo) {
        boo.load();
        boo.volume = 0.6;
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
    if (!isVanessaMode()) {
        console.log('Not in Vanessa mode, skipping clap');
        return;
    }
    
    unlockVanessaAudio();
    
    const clapSound = document.getElementById('vanessa-correct');
    if (!clapSound) {
        console.log('Clap sound element not found!');
        return;
    }
    
    console.log('Trying to play clap sound...');
    clapSound.currentTime = 0;
    const playPromise = clapSound.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Clap sound played successfully!');
        }).catch(e => {
            console.error('Clap sound failed:', e);
            // Try to unlock and play again
            document.body.addEventListener('click', () => {
                clapSound.play().then(() => {
                    console.log('Clap played after retry');
                });
            }, { once: true });
        });
    }
}

// Play boo sound for wrong answer
function playVanessaWrong() {
    if (!isVanessaMode()) {
        console.log('Not in Vanessa mode, skipping boo');
        return;
    }
    
    unlockVanessaAudio();
    
    const booSound = document.getElementById('vanessa-wrong');
    if (!booSound) {
        console.log('Boo sound element not found!');
        return;
    }
    
    console.log('Trying to play boo sound...');
    booSound.currentTime = 0;
    const playPromise = booSound.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            console.log('✅ Boo sound played successfully!');
        }).catch(e => {
            console.error('Boo sound failed:', e);
            // Try to unlock and play again
            document.body.addEventListener('click', () => {
                booSound.play().then(() => {
                    console.log('Boo played after retry');
                });
            }, { once: true });
        });
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    console.log('Vanessa sounds script loaded');
    
    // Preload audio
    const bgMusic = document.getElementById('vanessa-bg-music');
    const clap = document.getElementById('vanessa-correct');
    const boo = document.getElementById('vanessa-wrong');
    
    if (bgMusic) {
        bgMusic.preload = 'auto';
        console.log('Background music found');
    }
    if (clap) {
        clap.preload = 'auto';
        console.log('Clap sound found');
    }
    if (boo) {
        boo.preload = 'auto';
        console.log('Boo sound found');
    }
    
    // Unlock on first user interaction
    document.body.addEventListener('click', () => {
        unlockVanessaAudio();
        if (isVanessaMode()) {
            playVanessaBgMusic();
        }
    }, { once: true });
    
    // Check if Vanessa mode on load
    if (isVanessaMode()) {
        vanessaModeActive = true;
        console.log('Vanessa mode active on load');
    }
});