// Main App Logic with Sample Preloading

let samplesLoaded = false;

function startExercise(type) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show selected screen
    const screenId = type + '-screen';
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        
        // Initialize exercise
        switch(type) {
            case 'intervalle':
                if (typeof initIntervalle === 'function') initIntervalle();
                break;
            case 'akkorde':
                if (typeof initAkkorde === 'function') initAkkorde();
                break;
            case 'rhythmus':
                if (typeof initRhythmus === 'function') initRhythmus();
                break;
        }
    }
}

function goHome() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('welcome-screen').classList.add('active');
}

// Initialize app and preload samples
window.addEventListener('DOMContentLoaded', async () => {
    console.log('🎵 Gehörbildungstrainer initialisiert');
    
    // Unlock audio on first click
    document.body.addEventListener('click', async () => {
        if (!samplesLoaded && typeof unlockAudio === 'function') {
            await unlockAudio();
            console.log('🔓 Audio entsperrt');
            
            // Preload samples
            if (typeof preloadSamples === 'function') {
                await preloadSamples();
                samplesLoaded = true;
            }
        }
    }, { once: true });
    
    console.log('✅ Klicke irgendwo um Audio zu aktivieren');
});