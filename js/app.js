// Screen Management
function startExercise(type) {
    // Initialize audio
    getAudioContext();
    
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
    
    // Initialize audio on first click anywhere
    document.body.addEventListener('click', function() {
        getAudioContext();
    }, { once: true });
});