// Melodiediktat Logic based on BW official guidelines
// 4 Takte, 4/4-Takt, bis zu 3 Vorzeichen, leitereigene Töne, Ambitus > Oktave
// Mit rhythmischer Vielfalt: Viertel, Halbe, Ganze, Achtel
// Diktiermodus: 1-4, dann 1, 1, 1+2, 2, 2+3, 3, 3+4, 4, 4, dann 1-4

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
let melodieStats = { correct: 0, total: 0 };
let melodiePlaybackStep = 0;

// Diktiermodus Steps nach offiziellen Vorgaben
const melodieDiktierSteps = [
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

function initMelodie() {
    melodieStats = { correct: 0, total: 0 };
    updateMelodieStats();
    generateNewMelodie();
}

function generateNewMelodie() {
    melodiePlaybackStep = 0;
    
    // Random key (up to 3 accidentals)
    const tonart = tonarten[Math.floor(Math.random() * tonarten.length)];
    
    // Generate 4 bars of melody with rhythm and ambitus > octave
    const startNote = getRandomNote('C3', 'C5');
    const melody = generateMusicalMelody(tonart, startNote);
    
    // Split into bars based on duration
    const bars = splitMelodyIntoBars(melody);
    
    currentMelodie = {
        tonart: tonart,
        startNote: startNote,
        melody: melody,
        bars: bars
    };
    
    // Clear notation
    clearNotation('notation-melodie');
    
    // Display key info
    document.getElementById('melodie-tonart').textContent = tonart.name;
    document.getElementById('melodie-startton').textContent = startNote;
    
    // Reset UI
    document.getElementById('melodie-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('show-melodie-solution').style.display = 'none';
    document.getElementById('next-melodie').style.display = 'none';
    document.getElementById('play-melodie').disabled = false;
    document.getElementById('continue-melodie').style.display = 'none';
    document.getElementById('continue-melodie').disabled = false;
}

function generateMusicalMelody(tonart, startNote) {
    const melody = [];
    const startIndex = allNotes.indexOf(startNote);
    
    let currentIndex = startIndex;
    let minIndex = startIndex;
    let maxIndex = startIndex;
    let lastNote = null;
    
    // Generate 4 bars = 16 quarter note beats
    let beatsRemaining = 16;
    
    while (beatsRemaining > 0) {
        // Choose rhythm value (in quarter notes)
        let duration;
        if (beatsRemaining >= 4 && Math.random() > 0.7) {
            duration = 4; // Whole note
        } else if (beatsRemaining >= 2 && Math.random() > 0.6) {
            duration = 2; // Half note
        } else if (beatsRemaining >= 1.5 && Math.random() > 0.5) {
            duration = 1.5; // Dotted quarter
        } else if (beatsRemaining >= 1) {
            duration = 1; // Quarter note
        } else if (beatsRemaining >= 0.5) {
            duration = 0.5; // Eighth note
        } else {
            duration = beatsRemaining;
        }
        
        // Make sure we don't exceed remaining beats
        duration = Math.min(duration, beatsRemaining);
        
        // Choose next note - NEVER the same as last note!
        let newIndex;
        let attempts = 0;
        do {
            // More interesting intervals
            const possibleSteps = [-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7];
            // Favor smaller intervals more often for singability
            const stepWeights = [1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1];
            const totalWeight = stepWeights.reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            let stepIndex = 0;
            for (let i = 0; i < stepWeights.length; i++) {
                random -= stepWeights[i];
                if (random <= 0) {
                    stepIndex = i;
                    break;
                }
            }
            const step = possibleSteps[stepIndex];
            
            newIndex = currentIndex + step;
            
            // Keep within reasonable range
            newIndex = Math.max(allNotes.indexOf('C3'), Math.min(allNotes.indexOf('C6'), newIndex));
            
            attempts++;
        } while (newIndex === currentIndex && attempts < 20); // NEVER repeat the same note!
        
        minIndex = Math.min(minIndex, newIndex);
        maxIndex = Math.max(maxIndex, newIndex);
        
        melody.push({
            note: allNotes[newIndex],
            duration: duration
        });
        
        currentIndex = newIndex;
        lastNote = allNotes[newIndex];
        beatsRemaining -= duration;
    }
    
    // Ensure ambitus > octave (12 semitones)
    const ambitus = maxIndex - minIndex;
    if (ambitus <= 12) {
        // Regenerate if ambitus too small
        return generateMusicalMelody(tonart, startNote);
    }
    
    return melody;
}

function splitMelodyIntoBars(melody) {
    const bars = [[], [], [], []];
    let currentBar = 0;
    let beatsInBar = 0;
    
    for (const noteObj of melody) {
        if (beatsInBar + noteObj.duration > 4) {
            // Move to next bar
            currentBar++;
            beatsInBar = 0;
        }
        
        if (currentBar < 4) {
            bars[currentBar].push(noteObj);
            beatsInBar += noteObj.duration;
        }
    }
    
    return bars;
}

// Play count-in (4 beats with metronome click)
async function playMelodieCountIn() {
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

// Play melody with rhythm
async function playMelodyWithRhythm(noteObjs) {
    if (!noteObjs || noteObjs.length === 0) return;
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    const beatDuration = 1.0; // 60 BPM = 1 second per quarter note
    let currentTime = ctx.currentTime + 0.05;
    
    for (const noteObj of noteObjs) {
        const freq = noteFrequencies[noteObj.note];
        if (freq) {
            const noteDuration = noteObj.duration * beatDuration * 0.95; // Slight separation
            playPianoTone(freq, currentTime, noteDuration);
            currentTime += noteObj.duration * beatDuration;
        }
    }
    
    const totalDuration = (currentTime - ctx.currentTime) * 1000;
    await new Promise(resolve => setTimeout(resolve, totalDuration));
}

async function playMelodie() {
    if (!currentMelodie) return;
    
    const playBtn = document.getElementById('play-melodie');
    const continueBtn = document.getElementById('continue-melodie');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        melodiePlaybackStep = 0;
        
        // Play cadence first to establish key (simplified - just C major I-V-I)
        await playNoteSequence([['C4', 'E4', 'G4'], ['G4', 'B4', 'D5'], ['C4', 'E4', 'G4']], 0.2);
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Play count-in (4 beats)
        await playMelodieCountIn();
        
        // Small pause after count-in
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Play all 4 bars with rhythm
        await playMelodyWithRhythm(currentMelodie.melody);
        
        melodiePlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = melodieDiktierSteps[melodiePlaybackStep].label + ' ▶';
        
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
        if (melodiePlaybackStep >= 1 && melodiePlaybackStep < melodieDiktierSteps.length) {
            const step = melodieDiktierSteps[melodiePlaybackStep];
            
            // Collect notes from specified bars
            let notesToPlay = [];
            step.bars.forEach(barIndex => {
                notesToPlay = notesToPlay.concat(currentMelodie.bars[barIndex]);
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
            
            // Play the specified bars with rhythm
            await playMelodyWithRhythm(notesToPlay);
            
            melodiePlaybackStep++;
            
            if (melodiePlaybackStep < melodieDiktierSteps.length) {
                continueBtn.textContent = melodieDiktierSteps[melodiePlaybackStep].label + ' ▶';
            } else {
                // Finished all steps
                continueBtn.style.display = 'none';
                document.getElementById('show-melodie-solution').style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error continuing melody:', error);
    }
    
    continueBtn.disabled = false;
}

function showMelodieSolution() {
    melodieStats.total++;
    updateMelodieStats();
    
    const feedback = document.getElementById('melodie-feedback');
    feedback.textContent = '✅ Hier ist die Lösung. Vergleiche mit deiner Aufschrift!';
    feedback.className = 'feedback show correct';
    
    // Show notation info (can't display complex rhythm in VexFlow easily)
    const element = document.getElementById('notation-melodie');
    if (element) {
        let melodyText = '<p style="text-align: center; padding: 30px; font-size: 1.1em;"><strong>Melodie-Lösung:</strong><br><br>';
        melodyText += '<strong>Tonart:</strong> ' + currentMelodie.tonart.name + '<br>';
        melodyText += '<strong>Anfangston:</strong> ' + currentMelodie.startNote + '<br><br>';
        
        for (let i = 0; i < currentMelodie.bars.length; i++) {
            melodyText += '<strong>Takt ' + (i + 1) + ':</strong> ';
            currentMelodie.bars[i].forEach(noteObj => {
                let rhythmName = '';
                if (noteObj.duration === 4) rhythmName = ' (Ganze)';
                else if (noteObj.duration === 2) rhythmName = ' (Halbe)';
                else if (noteObj.duration === 1.5) rhythmName = ' (Viertel♪)';
                else if (noteObj.duration === 1) rhythmName = ' (Viertel)';
                else if (noteObj.duration === 0.5) rhythmName = ' (Achtel)';
                
                melodyText += noteObj.note + rhythmName + ' ';
            });
            melodyText += '<br>';
        }
        
        melodyText += '<br><em>Tipp: Spiele die Melodie mehrmals ab und vergleiche!</em></p>';
        element.innerHTML = melodyText;
    }
    
    document.getElementById('next-melodie').style.display = 'block';
    document.getElementById('show-melodie-solution').style.display = 'none';
}

function nextMelodie() {
    generateNewMelodie();
}

function updateMelodieStats() {
    document.getElementById('melodie-total').textContent = melodieStats.total;
}