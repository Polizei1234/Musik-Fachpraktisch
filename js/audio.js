// Audio Context - initialize lazily
let audioContext = null;

function getAudioContext() {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    return audioContext;
}

// Note frequencies (C2 to C6 range for variety)
const noteFrequencies = {
    'C2': 65.41, 'C#2': 69.30, 'D2': 73.42, 'D#2': 77.78, 'E2': 82.41, 'F2': 87.31,
    'F#2': 92.50, 'G2': 98.00, 'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61,
    'F#3': 185.00, 'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23,
    'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
    'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46,
    'F#5': 739.99, 'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
    'C6': 1046.50
};

// Get all note names in chromatic order
const allNotes = Object.keys(noteFrequencies);

// Improved piano tone generator with harmonics
function playPianoNote(frequency, startTime, duration = 1.0) {
    const ctx = getAudioContext();
    const masterGain = ctx.createGain();
    
    // Create multiple oscillators for harmonics (piano has rich overtones)
    const harmonics = [
        { mult: 1.0, gain: 1.0 },      // Fundamental
        { mult: 2.0, gain: 0.5 },      // 2nd harmonic (octave)
        { mult: 3.0, gain: 0.25 },     // 3rd harmonic
        { mult: 4.0, gain: 0.15 },     // 4th harmonic
        { mult: 5.0, gain: 0.08 },     // 5th harmonic
        { mult: 6.0, gain: 0.05 }      // 6th harmonic
    ];
    
    harmonics.forEach(harmonic => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        // Use sine waves for cleaner harmonics
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency * harmonic.mult, startTime);
        
        // Set relative gain for this harmonic
        gainNode.gain.setValueAtTime(harmonic.gain * 0.3, startTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(masterGain);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    });
    
    // ADSR Envelope for realistic piano sound
    const attackTime = 0.01;      // Very fast attack
    const decayTime = 0.2;        // Quick decay
    const sustainLevel = 0.25;    // Lower sustain
    const releaseTime = 0.4;      // Longer release
    
    masterGain.gain.setValueAtTime(0, startTime);
    masterGain.gain.linearRampToValueAtTime(0.8, startTime + attackTime);
    masterGain.gain.exponentialRampToValueAtTime(sustainLevel, startTime + attackTime + decayTime);
    masterGain.gain.setValueAtTime(sustainLevel, startTime + duration - releaseTime);
    masterGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    
    // Add a subtle lowpass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3000, startTime);
    filter.Q.setValueAtTime(1, startTime);
    
    masterGain.connect(filter);
    filter.connect(ctx.destination);
    
    return duration;
}

// Play a sequence of notes
async function playNoteSequence(notes, gap = 0.15) {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    let currentTime = now + 0.05;
    
    for (const note of notes) {
        if (typeof note === 'string') {
            // Single note
            const freq = noteFrequencies[note];
            if (freq) {
                playPianoNote(freq, currentTime, 0.9);
                currentTime += 0.9 + gap;
            }
        } else if (Array.isArray(note)) {
            // Chord (simultaneous notes)
            note.forEach(n => {
                const freq = noteFrequencies[n];
                if (freq) playPianoNote(freq, currentTime, 1.5);
            });
            currentTime += 1.5 + gap;
        }
    }
    
    // Return promise that resolves when all notes are done
    const totalDuration = (currentTime - now) * 1000;
    return new Promise(resolve => setTimeout(resolve, totalDuration));
}

// Play rhythm pattern (single pitch)
async function playRhythmPattern(pattern, pitch = 'C4') {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    let currentTime = now + 0.05;
    const beatDuration = 60 / 60; // Quarter note at 60 BPM = 1 second
    
    const freq = noteFrequencies[pitch];
    if (!freq) return;
    
    for (const note of pattern) {
        if (note.duration > 0) {
            playPianoNote(freq, currentTime, note.duration * beatDuration * 0.8);
        }
        currentTime += note.duration * beatDuration;
    }
    
    const totalDuration = (currentTime - now) * 1000;
    return new Promise(resolve => setTimeout(resolve, totalDuration));
}

// Get a random note within range
function getRandomNote(minNote = 'C3', maxNote = 'C6') {
    const minIndex = allNotes.indexOf(minNote);
    const maxIndex = allNotes.indexOf(maxNote);
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    return allNotes[randomIndex];
}

// Get note by interval (in semitones)
function getNoteByInterval(baseNote, semitones) {
    const baseIndex = allNotes.indexOf(baseNote);
    if (baseIndex === -1) return null;
    
    const newIndex = baseIndex + semitones;
    if (newIndex < 0 || newIndex >= allNotes.length) return null;
    
    return allNotes[newIndex];
}

// Convert note name to VexFlow notation
function noteToVexFlow(noteName) {
    // Convert 'C#4' to 'C#/4' for VexFlow
    const match = noteName.match(/([A-G]#?)([0-9])/);
    if (match) {
        return `${match[1]}/${match[2]}`;
    }
    return noteName;
}