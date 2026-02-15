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
    { name: 'a-Moll', key: 'A', mode: 'minor', sharps: 0, flats: 0, scale: [0, 2, 3, 5, 7, 8, 11] }, // harmonic minor
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

function initMelodie() {
    melodieStats = { correct: 0, wrong: 0, total: 0 };
    updateMelodieStats();
    generateNewMelodie();
}

function generateNewMelodie() {
    hasPlayedMelodie = false;
    
    // Random key (up to 3 accidentals)
    const tonart = tonarten[Math.floor(Math.random() * tonarten.length)];
    
    // Generate 4 bars of melody with ambitus > octave
    const startNote = getRandomNote('C3', 'C5');
    const melody = generateMelodyBars(tonart, startNote);
    
    currentMelodie = {
        tonart: tonart,
        startNote: startNote,
        melody: melody
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
    document.getElementById('replay-melodie').disabled = true;
    
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
        // Get scale degree
        const scaleDegree = tonart.scale[Math.floor(Math.random() * tonart.scale.length)];
        
        // Move to a nearby scale tone
        const direction = Math.random() > 0.5 ? 1 : -1;
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
    const replayBtn = document.getElementById('replay-melodie');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    // Play cadence first to establish key
    await playCadence(currentMelodie.tonart);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Play according to official dictation mode:
    // Bars 1-4, then 1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, then 1-4
    
    const bars = [
        currentMelodie.melody.slice(0, 4),
        currentMelodie.melody.slice(4, 8),
        currentMelodie.melody.slice(8, 12),
        currentMelodie.melody.slice(12, 16)
    ];
    
    // First: All 4 bars
    await playNoteSequence(currentMelodie.melody, 0.1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Then each bar 3 times
    for (let barIndex = 0; barIndex < 4; barIndex++) {
        for (let repeat = 0; repeat < 3; repeat++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            await playNoteSequence(bars[barIndex], 0.1);
        }
    }
    
    // Finally: All 4 bars again
    await new Promise(resolve => setTimeout(resolve, 1500));
    await playNoteSequence(currentMelodie.melody, 0.1);
    
    if (!hasPlayedMelodie) {
        document.getElementById('check-melodie').style.display = 'block';
        document.getElementById('melodie-input').disabled = false;
        hasPlayedMelodie = true;
    }
    
    playBtn.disabled = false;
    replayBtn.disabled = false;
}

async function playCadence(tonart) {
    // Simple I-IV-V-I cadence to establish key
    const root = tonart.key;
    const rootIndex = allNotes.findIndex(n => n.startsWith(root) && n.includes('4'));
    
    if (rootIndex === -1) return;
    
    const I = [allNotes[rootIndex], allNotes[rootIndex + 4], allNotes[rootIndex + 7]];
    const IV = [allNotes[rootIndex + 5], allNotes[rootIndex + 9], allNotes[rootIndex + 12]];
    const V = [allNotes[rootIndex + 7], allNotes[rootIndex + 11], allNotes[rootIndex + 14]];
    
    await playNoteSequence([I, IV, V, I], 0.2);
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