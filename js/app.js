// Screen Management
function startExercise(type) {
    // Ensure audio context is ready
    if (typeof getAudioContext === 'function') {
        getAudioContext();
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
    
    // Don't close audio context - just let it be ready for next use
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('Gehörbildungstrainer geladen!');
    console.log('Alle 4 Module aktiv: Intervalle, Akkorde, Melodiediktat, Rhythmusdiktat');
    
    // Pre-initialize audio context on first user interaction
    document.body.addEventListener('click', function initAudio() {
        if (typeof getAudioContext === 'function') {
            getAudioContext();
        }
        document.body.removeEventListener('click', initAudio);
    }, { once: true });
});