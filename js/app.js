// Screen Management
function startExercise(type) {
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
    }
}

function goHome() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('welcome-screen').classList.add('active');
    
    // Stop any playing audio
    if (typeof audioContext !== 'undefined' && audioContext.state !== 'closed') {
        audioContext.close().then(() => {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        });
    }
}

// Initialize on load
window.addEventListener('load', () => {
    console.log('Gehörbildungstrainer geladen!');
});