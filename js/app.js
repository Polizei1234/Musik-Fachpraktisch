// Screen Management
function startExercise(type) {
    // Initialize audio context immediately on user interaction (Safari requirement)
    if (typeof initAudioContext === 'function') {
        initAudioContext();
    }
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const screenId = type + '-screen';
    document.getElementById(screenId).classList.add('active');
    
    // Initialize exercise
    if (type === 'intervalle') {
        initIntervalle();
    } else if (type === 'akkorde') {
        initAkkorde();
    } else if (type === 'melodie') {
        initMelodie();
    } else if (type === 'rhythmus') {
        initRhythmus();
    }
}

function goHome() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('welcome-screen').classList.add('active');
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('Gehörbildungstrainer geladen!');
    console.log('Alle 4 Module aktiv: Intervalle, Akkorde, Melodiediktat, Rhythmusdiktat');
    console.log('Browser:', navigator.userAgent.includes('Safari') ? 'Safari' : 'Other');
    
    // For Safari: Initialize AudioContext on ANY click
    let audioReady = false;
    document.addEventListener('click', function ensureAudio() {
        if (!audioReady && typeof initAudioContext === 'function') {
            console.log('Initializing AudioContext on user click...');
            const ctx = initAudioContext();
            if (ctx) {
                console.log('AudioContext ready, state:', ctx.state);
                audioReady = true;
            }
        }
    });
});