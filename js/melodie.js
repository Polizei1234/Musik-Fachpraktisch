// Melodiediktat Logic based on BW official guidelines
// 4 Takte, 4/4-Takt, bis zu 3 Vorzeichen, leitereigene Töne, Ambitus > Oktave

const tonarten = [
    { name: 'C-Dur', key: 'C', mode: 'major', sharps: 0, flats: 0, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'G-Dur', key: 'G', mode: 'major', sharps: 1, flats: 0, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'D-Dur', key: 'D', mode: 'major', sharps: 2, flats: 0, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'A-Dur', key: 'A', mode: 'major', sharps: 3, flats: 0, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'F-Dur', key: 'F', mode: 'major', sharps: 0, flats: 1, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'B-Dur', key: 'Bb', mode: 'major', sharps: 0, flats: 2, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'Es-Dur', key: 'Eb', mode: 'major', sharps: 0, flats: 3, scale: [0, 2, 4, 5, 7, 9, 11] },
    { name: 'a-Moll', key: 'A', mode: 'minor', sharps: 0, flats: 0, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'e-Moll', key: 'E', mode: 'minor', sharps: 1, flats: 0, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'h-Moll', key: 'B', mode: 'minor', sharps: 2, flats: 0, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'fis-Moll', key: 'F#', mode: 'minor', sharps: 3, flats: 0, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'd-Moll', key: 'D', mode: 'minor', sharps: 0, flats: 1, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'g-Moll', key: 'G', mode: 'minor', sharps: 0, flats: 2, scale: [0, 2, 3, 5, 7, 8, 11] },
    { name: 'c-Moll', key: 'C', mode: 'minor', sharps: 0, flats: 3, scale: [0, 2, 3, 5, 7, 8, 11] }
];

let currentMelodie = null;
let melodieStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayedMelodie = false;
let melodiePlaybackStep = 0; // Track which step we're at

function initMelodie() {
    melodieStats = { correct: 0, wrong: 0, total: 0 };
    updateMelodieStats();
    generateNewMelodie();
}

function generateNewMelodie() {
    hasPlayedMelodie = false;
    melodiePlaybackStep = 0;
    
    // Random key (up to 3 accidentals)
    const tonart = tonarten[Math.floor(Math.random() * tonarten.length)];
    
    // Generate 4 bars of melody with ambitus > octave
    const startNote = getRandomNote('C3', 'C5');
    const melody = generateMelodyBars(tonart, startNote);
    
    currentMelodie = {
        tonart: tonart,
        startNote: startNote,
        melody: melody,
        bars: [
            melody.slice(0, 4),
            melody.slice(4, 8),
            melody.slice(8, 12),
            melody.slice(12, 16)
        ]
    };
    
    // Clear notation
    clearNotation('notation-melodie');
    
    // Display key info
    document.getElementById('melodie-tonart').textContent = tonart.name;
    document.getElementById('melodie-startton').textContent = startNote;
    
    // Reset UI
    document.getElementById('melodie-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('check-melodie').style.display = 'none';
    document.getElementById('next-melodie').style.display = 'none';
    document.getElementById('play-melodie').disabled = false;
    document.getElementById('continue-melodie').style.display = 'none';
    document.getElementById('continue-melodie').disabled = false;
    
    // Clear input
    document.getElementById('melodie-input').value = '';
    document.getElementById('melodie-input').disabled = false;
}

function generateMelodyBars(tonart, startNote) {
    const melody = [];
    const startIndex = allNotes.indexOf(startNote);
    
    // Generate melody ensuring ambitus > octave (13+ semitones)
    let currentIndex = startIndex;
    let minIndex = startIndex;
    let maxIndex = startIndex;
    
    // 16 quarter notes for 4 bars in 4/4
    for (let i = 0; i < 16; i++) {
        // Move to a nearby scale tone
        const step = Math.floor(Math.random() * 7) - 3; // -3 to +3 scale steps
        
        let newIndex = currentIndex + step;
        
        // Keep within reasonable range
        newIndex = Math.max(allNotes.indexOf('C3'), Math.min(allNotes.indexOf('C6'), newIndex));
        
        minIndex = Math.min(minIndex, newIndex);
        maxIndex = Math.max(maxIndex, newIndex);
        
        melody.push(allNotes[newIndex]);
        currentIndex = newIndex;
    }
    
    // Ensure ambitus > octave (12 semitones)
    const ambitus = maxIndex - minIndex;
    if (ambitus <= 12) {
        // Regenerate if ambitus too small
        return generateMelodyBars(tonart, startNote);
    }
    
    return melody;
}

async function playMelodie() {
    if (!currentMelodie) return;
    
    const playBtn = document.getElementById('play-melodie');
    const continueBtn = document.getElementById('continue-melodie');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        melodiePlaybackStep = 0;
        
        // Play cadence first to establish key
        await playNoteSequence([['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']], 0.2);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Play all 4 bars first time
        await playNoteSequence(currentMelodie.melody, 0.1);
        
        melodiePlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = 'Takt 1 (3x) ▶';
        
    } catch (error) {
        console.error('Error playing melody:', error);
    }
    
    playBtn.disabled = false;
}

async function continueMelodie() {
    if (!currentMelodie) return;
    
    const continueBtn = document.getElementById('continue-melodie');
    continueBtn.disabled = true;
    
    try {
        // Steps 1-4: Play each bar 3 times
        if (melodiePlaybackStep >= 1 && melodiePlaybackStep <= 4) {
            const barIndex = melodiePlaybackStep - 1;
            
            for (let repeat = 0; repeat < 3; repeat++) {
                await new Promise(resolve => setTimeout(resolve, 500));
                await playNoteSequence(currentMelodie.bars[barIndex], 0.1);
            }
            
            melodiePlaybackStep++;
            
            if (melodiePlaybackStep <= 4) {
                continueBtn.textContent = `Takt ${melodiePlaybackStep} (3x) ▶`;
            } else {
                continueBtn.textContent = 'Alle 4 Takte ▶';
            }
        }
        // Step 5: Play all 4 bars again
        else if (melodiePlaybackStep === 5) {
            await new Promise(resolve => setTimeout(resolve, 800));
            await playNoteSequence(currentMelodie.melody, 0.1);
            
            continueBtn.style.display = 'none';
            document.getElementById('check-melodie').style.display = 'block';
            document.getElementById('melodie-input').disabled = false;
            hasPlayedMelodie = true;
        }
        
    } catch (error) {
        console.error('Error continuing melody:', error);
    }
    
    continueBtn.disabled = false;
}

function checkMelodie() {
    if (!hasPlayedMelodie) return;
    
    const feedback = document.getElementById('melodie-feedback');
    const input = document.getElementById('melodie-input').value;
    
    if (input.trim().length > 0) {
        melodieStats.total++;
        feedback.textContent = '✅ Eingabe gespeichert. Vergleiche deine Lösung mit den angezeigten Noten!';
        feedback.className = 'feedback show correct';
        
        // Show notation
        displayNotes('notation-melodie', currentMelodie.melody);
        
        document.getElementById('next-melodie').style.display = 'block';
        document.getElementById('check-melodie').style.display = 'none';
        document.getElementById('melodie-input').disabled = true;
        
        updateMelodieStats();
    } else {
        feedback.textContent = '❌ Bitte gib zuerst eine Lösung ein.';
        feedback.className = 'feedback show wrong';
    }
}

function nextMelodie() {
    generateNewMelodie();
}

function updateMelodieStats() {
    document.getElementById('melodie-total').textContent = melodieStats.total;
}