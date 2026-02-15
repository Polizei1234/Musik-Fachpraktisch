// Rhythmusdiktat Logic based on BW official guidelines
// 4 Takte, 4/4-Takt, Viertel/Achtel/Sechzehntel, mit Synkopen, Triolen, Punktierungen
// Tempo: Viertel = ca. 60

let currentRhythmus = null;
let rhythmusStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayedRhythmus = false;
let rhythmusPlaybackStep = 0;

function initRhythmus() {
    rhythmusStats = { correct: 0, wrong: 0, total: 0 };
    updateRhythmusStats();
    generateNewRhythmus();
}

function generateNewRhythmus() {
    hasPlayedRhythmus = false;
    rhythmusPlaybackStep = 0;
    
    // Generate 4 bars of rhythm with Synkopen, Triolen, Punktierungen
    const bars = [];
    
    for (let i = 0; i < 4; i++) {
        bars.push(generateRhythmBar());
    }
    
    currentRhythmus = {
        bars: bars,
        pattern: bars.flat()
    };
    
    // Clear notation
    clearNotation('notation-rhythmus');
    
    // Reset UI
    document.getElementById('rhythmus-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('check-rhythmus').style.display = 'none';
    document.getElementById('next-rhythmus').style.display = 'none';
    document.getElementById('play-rhythmus').disabled = false;
    document.getElementById('continue-rhythmus').style.display = 'none';
    document.getElementById('continue-rhythmus').disabled = false;
    
    // Clear input
    document.getElementById('rhythmus-input').value = '';
    document.getElementById('rhythmus-input').disabled = false;
}

function generateRhythmBar() {
    const patterns = [
        // Synkopen (Syncopation)
        [{duration: 0.5}, {duration: 1}, {duration: 0.5}, {duration: 1}, {duration: 0.5}, {duration: 0.5}],
        [{duration: 0.25}, {duration: 0.25}, {duration: 1.5}, {duration: 1}, {duration: 1}],
        
        // Triolen (Triplets)
        [{duration: 1/3}, {duration: 1/3}, {duration: 1/3}, {duration: 1}, {duration: 1}, {duration: 1}],
        [{duration: 1}, {duration: 2/3}, {duration: 2/3}, {duration: 2/3}, {duration: 1}],
        
        // Punktierungen (Dotted notes)
        [{duration: 1.5}, {duration: 0.5}, {duration: 1}, {duration: 1}],
        [{duration: 1}, {duration: 0.75}, {duration: 0.25}, {duration: 1}, {duration: 1}],
        [{duration: 0.75}, {duration: 0.25}, {duration: 0.75}, {duration: 0.25}, {duration: 1}, {duration: 1}],
        
        // Mixed patterns
        [{duration: 0.5}, {duration: 0.5}, {duration: 1.5}, {duration: 0.5}, {duration: 1}],
        [{duration: 1}, {duration: 0.5}, {duration: 1}, {duration: 0.5}, {duration: 1}],
        [{duration: 0.25}, {duration: 0.25}, {duration: 0.5}, {duration: 1}, {duration: 1}, {duration: 1}]
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

async function playRhythmus() {
    if (!currentRhythmus) return;
    
    const playBtn = document.getElementById('play-rhythmus');
    const continueBtn = document.getElementById('continue-rhythmus');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        rhythmusPlaybackStep = 0;
        
        // Play all 4 bars first time
        await playRhythmPattern(currentRhythmus.pattern, 'C4');
        
        rhythmusPlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = 'Takt 1 (3x) ▶';
        
    } catch (error) {
        console.error('Error playing rhythm:', error);
    }
    
    playBtn.disabled = false;
}

async function continueRhythmus() {
    if (!currentRhythmus) return;
    
    const continueBtn = document.getElementById('continue-rhythmus');
    continueBtn.disabled = true;
    
    try {
        // Steps 1-4: Play each bar 3 times
        if (rhythmusPlaybackStep >= 1 && rhythmusPlaybackStep <= 4) {
            const barIndex = rhythmusPlaybackStep - 1;
            
            for (let repeat = 0; repeat < 3; repeat++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                await playRhythmPattern(currentRhythmus.bars[barIndex], 'C4');
            }
            
            rhythmusPlaybackStep++;
            
            if (rhythmusPlaybackStep <= 4) {
                continueBtn.textContent = `Takt ${rhythmusPlaybackStep} (3x) ▶`;
            } else {
                continueBtn.textContent = 'Alle 4 Takte ▶';
            }
        }
        // Step 5: Play all 4 bars again
        else if (rhythmusPlaybackStep === 5) {
            await new Promise(resolve => setTimeout(resolve, 800));
            await playRhythmPattern(currentRhythmus.pattern, 'C4');
            
            continueBtn.style.display = 'none';
            document.getElementById('check-rhythmus').style.display = 'block';
            document.getElementById('rhythmus-input').disabled = false;
            hasPlayedRhythmus = true;
        }
        
    } catch (error) {
        console.error('Error continuing rhythm:', error);
    }
    
    continueBtn.disabled = false;
}

function checkRhythmus() {
    if (!hasPlayedRhythmus) return;
    
    const feedback = document.getElementById('rhythmus-feedback');
    const input = document.getElementById('rhythmus-input').value;
    
    if (input.trim().length > 0) {
        rhythmusStats.total++;
        feedback.textContent = '✅ Eingabe gespeichert. Vergleiche deine Lösung mit den angezeigten Noten!';
        feedback.className = 'feedback show correct';
        
        // Show notation
        displayRhythmNotation('notation-rhythmus', currentRhythmus.bars);
        
        document.getElementById('next-rhythmus').style.display = 'block';
        document.getElementById('check-rhythmus').style.display = 'none';
        document.getElementById('rhythmus-input').disabled = true;
        
        updateRhythmusStats();
    } else {
        feedback.textContent = '❌ Bitte gib zuerst eine Lösung ein.';
        feedback.className = 'feedback show wrong';
    }
}

function nextRhythmus() {
    generateNewRhythmus();
}

function updateRhythmusStats() {
    document.getElementById('rhythmus-total').textContent = rhythmusStats.total;
}

function displayRhythmNotation(elementId, bars) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '<p style="text-align: center; padding: 40px;">Rhythmusnotation: ' + 
        bars.length + ' Takte mit Synkopen, Triolen und Punktierungen</p>';
}