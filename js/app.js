// App with audio unlock
function startExercise(type) {
    // Force audio init on exercise start
    const ctx = initAudio();
    if (ctx && ctx.state === 'suspended') {
        ctx.resume();
    }
    
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    const screenId = type + '-screen';
    document.getElementById(screenId).classList.add('active');
    
    if (type === 'intervalle') initIntervalle();
    else if (type === 'akkorde') initAkkorde();
    else if (type === 'melodie') initMelodie();
    else if (type === 'rhythmus') initRhythmus();
}

function goHome() {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('welcome-screen').classList.add('active');
}

// Test button
function addTestButton() {
    const testBtn = document.createElement('button');
    testBtn.innerHTML = '🔊 Test';
    testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;';
    testBtn.onclick = testAudio;
    document.body.appendChild(testBtn);
}

window.addEventListener('load', () => {
    log('App loaded!');
    addTestButton();
    
    // Unlock audio on first click ANYWHERE
    const unlockAudio = () => {
        log('User interaction detected');
        const ctx = initAudio();
        if (ctx) {
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => {
                    log('Context unlocked!');
                });
            }
            // Play silent sound to unlock
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.value = 0;
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.01);
        }
    };
    
    document.addEventListener('click', unlockAudio, { once: true });
    document.addEventListener('touchstart', unlockAudio, { once: true });
});