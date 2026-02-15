// Rhythmusdiktat Logic based on BW official guidelines
// 4 Takte, 4/4-Takt, Viertel/Achtel/Sechzehntel, mit Synkopen, Triolen, Punktierungen
// Tempo: Viertel = ca. 60
// Diktiermodus: 1-4, dann 1, 1, 1+2, 2, 2+3, 3, 3+4, 4, 4, 1-4

let currentRhythmus = null;
let rhythmusStats = { correct: 0, total: 0 };
let rhythmusPlaybackStep = 0;

// Diktiermodus Steps nach offiziellen Vorgaben
const diktierSteps = [
    { label: 'Takt 1-4', bars: [0, 1, 2, 3] },
    { label: 'Takt 1', bars: [0] },
    { label: 'Takt 1', bars: [0] },
    { label: 'Takt 1+2', bars: [0, 1] },
    { label: 'Takt 2', bars: [1] },
    { label: 'Takt 2+3', bars: [1, 2] },
    { label: 'Takt 3', bars: [2] },
    { label: 'Takt 3+4', bars: [2, 3] },
    { label: 'Takt 4', bars: [3] },
    { label: 'Takt 4', bars: [3] },
    { label: 'Takt 1-4', bars: [0, 1, 2, 3] }
];

function initRhythmus() {
    rhythmusStats = { correct: 0, total: 0 };
    updateRhythmusStats();
    generateNewRhythmus();
}

function generateNewRhythmus() {
    rhythmusPlaybackStep = 0;
    
    // Generate 4 bars of rhythm with Synkopen, Triolen, Punktierungen
    const bars = [];
    
    for (let i = 0; i < 4; i++) {
        bars.push(generateRhythmBar());
    }
    
    // Flatten bars array manually for Safari compatibility
    let pattern = [];
    bars.forEach(bar => {
        pattern = pattern.concat(bar);
    });
    
    currentRhythmus = {
        bars: bars,
        pattern: pattern
    };
    
    // Clear notation
    clearNotation('notation-rhythmus');
    
    // Reset UI
    document.getElementById('rhythmus-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('show-rhythmus-solution').style.display = 'none';
    document.getElementById('next-rhythmus').style.display = 'none';
    document.getElementById('play-rhythmus').disabled = false;
    document.getElementById('continue-rhythmus').style.display = 'none';
    document.getElementById('continue-rhythmus').disabled = false;
}

function generateRhythmBar() {
    const patterns = [
        // Synkopen (Syncopation) - muss 4 Schläge ergeben
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

// Play count-in (4 beats with metronome click)
async function playCountIn() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    const now = ctx.currentTime;
    const beatDuration = 60 / 60; // Quarter note at 60 BPM = 1 second
    
    // Play 4 metronome clicks
    for (let i = 0; i < 4; i++) {
        const startTime = now + (i * beatDuration);
        
        // Higher pitched click for first beat
        const freq = i === 0 ? 1000 : 800;
        
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(freq, startTime);
        
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + 0.05);
    }
    
    // Wait for count-in to finish
    await new Promise(resolve => setTimeout(resolve, beatDuration * 4 * 1000));
}

async function playRhythmus() {
    if (!currentRhythmus) {
        console.error('No rhythm generated');
        return;
    }
    
    const playBtn = document.getElementById('play-rhythmus');
    const continueBtn = document.getElementById('continue-rhythmus');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        rhythmusPlaybackStep = 0;
        
        // Play count-in first (4 beats)
        await playCountIn();
        
        // Small pause after count-in
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Play all 4 bars first time
        await playRhythmPattern(currentRhythmus.pattern, 'C4');
        
        rhythmusPlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = diktierSteps[rhythmusPlaybackStep].label + ' ▶';
        
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
        if (rhythmusPlaybackStep >= 1 && rhythmusPlaybackStep < diktierSteps.length) {
            const step = diktierSteps[rhythmusPlaybackStep];
            
            // Collect notes from specified bars
            let notesToPlay = [];
            step.bars.forEach(barIndex => {
                notesToPlay = notesToPlay.concat(currentRhythmus.bars[barIndex]);
            });
            
            // Play count-in "drei, vier" (2 beats)
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const beatDuration = 60 / 60;
            
            for (let i = 0; i < 2; i++) {
                const startTime = now + (i * beatDuration);
                const oscillator = ctx.createOscillator();
                const gainNode = ctx.createGain();
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, startTime);
                gainNode.gain.setValueAtTime(0.2, startTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.05);
                
                oscillator.connect(gainNode);
                gainNode.connect(ctx.destination);
                oscillator.start(startTime);
                oscillator.stop(startTime + 0.05);
            }
            
            await new Promise(resolve => setTimeout(resolve, beatDuration * 2 * 1000 + 200));
            
            // Play the specified bars
            await playRhythmPattern(notesToPlay, 'C4');
            
            rhythmusPlaybackStep++;
            
            if (rhythmusPlaybackStep < diktierSteps.length) {
                continueBtn.textContent = diktierSteps[rhythmusPlaybackStep].label + ' ▶';
            } else {
                // Finished all steps
                continueBtn.style.display = 'none';
                document.getElementById('show-rhythmus-solution').style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error continuing rhythm:', error);
    }
    
    continueBtn.disabled = false;
}

function showRhythmusSolution() {
    rhythmusStats.total++;
    updateRhythmusStats();
    
    const feedback = document.getElementById('rhythmus-feedback');
    feedback.textContent = '✅ Hier ist die Lösung. Vergleiche mit deiner Aufschrift!';
    feedback.className = 'feedback show correct';
    
    // Show notation
    displayRhythmNotation('notation-rhythmus', currentRhythmus.bars);
    
    document.getElementById('next-rhythmus').style.display = 'block';
    document.getElementById('show-rhythmus-solution').style.display = 'none';
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
    
    element.innerHTML = '<p style="text-align: center; padding: 40px; font-size: 1.1em;">' +
        '<strong>Rhythmus-Lösung:</strong><br><br>' +
        '4 Takte im 4/4-Takt<br>' +
        'Mit Synkopen, Triolen und Punktierungen<br><br>' +
        '<em>Tipp: Vergleiche deine handschriftliche Lösung Schlag für Schlag!</em></p>';
}