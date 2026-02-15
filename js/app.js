// App initialization
function startExercise(type) {
    // Force audio init
    initAudio();
    
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

// Test audio button for debugging
function addTestButton() {
    const testBtn = document.createElement('button');
    testBtn.textContent = '🔊 Test Audio';
    testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;';
    testBtn.onclick = () => {
        console.log('Test button clicked');
        testAudio();
    };
    document.body.appendChild(testBtn);
}

window.addEventListener('load', () => {
    console.log('App loaded!');
    
    // Add test button
    addTestButton();
    
    // Init audio on ANY click
    document.addEventListener('click', function initOnClick() {
        console.log('Click detected, initializing audio...');
        initAudio();
        document.removeEventListener('click', initOnClick);
    }, { once: true });
});