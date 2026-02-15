// App with strong audio unlock
function startExercise(type) {
    // Init audio
    initAudio();
    
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

// Big unlock button
function showUnlockPrompt() {
    const prompt = document.createElement('div');
    prompt.id = 'unlock-prompt';
    prompt.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 99999; text-align: center;';
    prompt.innerHTML = `
        <h2 style="margin: 0 0 20px 0;">🔊 Audio aktivieren</h2>
        <p style="margin: 0 0 20px 0;">Bitte klicke auf den Button um Audio zu aktivieren</p>
        <button id="unlock-btn" style="padding: 15px 40px; font-size: 18px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">▶ Audio aktivieren</button>
    `;
    document.body.appendChild(prompt);
    
    document.getElementById('unlock-btn').onclick = async () => {
        await unlockAudio();
        prompt.remove();
    };
}

// Test button
function addTestButton() {
    const testBtn = document.createElement('button');
    testBtn.innerHTML = '🔊 Test Audio';
    testBtn.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; font-weight: bold;';
    testBtn.onclick = testAudio;
    document.body.appendChild(testBtn);
}

window.addEventListener('load', () => {
    log('App loaded!');
    addTestButton();
    
    // Show unlock prompt after short delay
    setTimeout(() => {
        if (!audioUnlocked) {
            showUnlockPrompt();
        }
    }, 1000);
    
    // Try to unlock on any interaction
    const tryUnlock = async () => {
        log('Interaction');
        if (!audioUnlocked) {
            await unlockAudio();
        }
    };
    
    document.addEventListener('click', tryUnlock);
    document.addEventListener('touchstart', tryUnlock);
});