// Ultra-simple Web Audio - guaranteed to work
let audioContext = null;

// Initialize on first user interaction
function initAudio() {
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('Audio initialized!');
        } catch (e) {
            console.error('Audio init failed:', e);
            alert('Audio konnte nicht initialisiert werden. Bitte Browser neu laden.');
        }
    }
    return audioContext;
}

function getAudioContext() {
    return audioContext || initAudio();
}

// Note frequencies
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

const allNotes = Object.keys(noteFrequencies);

// Simple beep function - this WILL work
function beep(frequency, duration) {
    const ctx = getAudioContext();
    if (!ctx) {
        console.error('No audio context!');
        return;
    }
    
    // Resume if suspended
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.frequency.value = frequency;
    osc.type = 'sine';
    
    gain.gain.value = 0.3;
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
}

// Play single note
function playNote(noteName, duration = 0.5) {
    const freq = noteFrequencies[noteName];
    if (!freq) {
        console.error('Unknown note:', noteName);
        return;
    }
    
    console.log('Playing note:', noteName, freq);
    beep(freq, duration);
}

// Play sequence of notes
async function playNoteSequence(notes, gap = 0.15) {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    // Make sure audio is running
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    console.log('Playing sequence:', notes);
    
    for (const note of notes) {
        if (typeof note === 'string') {
            // Single note
            playNote(note, 0.5);
            await new Promise(r => setTimeout(r, (0.5 + gap) * 1000));
        } else if (Array.isArray(note)) {
            // Chord - play all at once
            note.forEach(n => playNote(n, 0.8));
            await new Promise(r => setTimeout(r, (0.8 + gap) * 1000));
        }
    }
}

// Play rhythm pattern
async function playRhythmPattern(pattern, pitch = 'C4') {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    const beatDuration = 1.0; // 60 BPM = 1 second per beat
    let delay = 0;
    
    for (const note of pattern) {
        setTimeout(() => {
            playNote(pitch, note.duration * beatDuration * 0.8);
        }, delay * 1000);
        delay += note.duration * beatDuration;
    }
    
    await new Promise(r => setTimeout(r, delay * 1000));
}

// Helper functions
function getRandomNote(minNote = 'C3', maxNote = 'C6') {
    const minIndex = allNotes.indexOf(minNote);
    const maxIndex = allNotes.indexOf(maxNote);
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    return allNotes[randomIndex];
}

function getNoteByInterval(baseNote, semitones) {
    const baseIndex = allNotes.indexOf(baseNote);
    if (baseIndex === -1) return null;
    const newIndex = baseIndex + semitones;
    if (newIndex < 0 || newIndex >= allNotes.length) return null;
    return allNotes[newIndex];
}

function noteToVexFlow(noteName) {
    const match = noteName.match(/([A-G]#?)([0-9])/);
    if (match) return `${match[1]}/${match[2]}`;
    return noteName;
}

// Test function
function testAudio() {
    console.log('Testing audio...');
    playNote('C4', 0.5);
    setTimeout(() => playNote('E4', 0.5), 600);
    setTimeout(() => playNote('G4', 0.5), 1200);
}