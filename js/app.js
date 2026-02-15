// Main App Logic

function startExercise(type) {
    // STOP Vanessa background music when entering exercises
    if (typeof stopVanessaBgMusic === 'function') {
        stopVanessaBgMusic();
        console.log('Stopped background music for exercise');
    }
    
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
            case 'melodie':
                if (typeof initMelodie === 'function') initMelodie();
                break;
            case 'rhythmus':
                if (typeof initRhythmus === 'function') initRhythmus();
                break;
        }
    }
}

function goHome() {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show welcome screen
    document.getElementById('welcome-screen').classList.add('active');
    
    // Start Vanessa background music if in Vanessa mode
    if (typeof playVanessaBgMusic === 'function') {
        setTimeout(() => playVanessaBgMusic(), 300);
    }
}

// Auto-unlock audio on page load with first interaction
window.addEventListener('DOMContentLoaded', () => {
    // Unlock piano audio on first click
    document.body.addEventListener('click', async () => {
        if (typeof unlockAudio === 'function') {
            await unlockAudio();
            console.log('Piano audio unlocked!');
        }
    }, { once: true });
    
    console.log('App initialized - click anywhere to enable audio');
});