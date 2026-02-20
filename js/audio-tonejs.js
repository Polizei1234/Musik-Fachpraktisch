// Professional Audio with Tone.js

let pianoSampler = null;
let audioInitialized = false;

// Initialize Tone.js Piano
async function initToneJS() {
    if (audioInitialized && pianoSampler) return true;
    
    console.log('🎹 Initializing Tone.js Piano...');
    
    try {
        // Start audio context
        await Tone.start();
        console.log('✅ AudioContext started');
        
        // Create Sampler with Salamander Grand Piano
        pianoSampler = new Tone.Sampler({
            urls: {
                'A0': 'A0.mp3',
                'C1': 'C1.mp3',
                'D#1': 'Ds1.mp3',
                'F#1': 'Fs1.mp3',
                'A1': 'A1.mp3',
                'C2': 'C2.mp3',
                'D#2': 'Ds2.mp3',
                'F#2': 'Fs2.mp3',
                'A2': 'A2.mp3',
                'C3': 'C3.mp3',
                'D#3': 'Ds3.mp3',
                'F#3': 'Fs3.mp3',
                'A3': 'A3.mp3',
                'C4': 'C4.mp3',
                'D#4': 'Ds4.mp3',
                'F#4': 'Fs4.mp3',
                'A4': 'A4.mp3',
                'C5': 'C5.mp3',
                'D#5': 'Ds5.mp3',
                'F#5': 'Fs5.mp3',
                'A5': 'A5.mp3',
                'C6': 'C6.mp3',
                'D#6': 'Ds6.mp3',
                'F#6': 'Fs6.mp3',
                'A6': 'A6.mp3',
                'C7': 'C7.mp3',
                'D#7': 'Ds7.mp3',
                'F#7': 'Fs7.mp3',
                'A7': 'A7.mp3',
                'C8': 'C8.mp3'
            },
            release: 3,
            baseUrl: 'https://tonejs.github.io/audio/salamander/'
        }).toDestination();
        
        console.log('⏳ Loading piano samples...');
        await Tone.loaded();
        
        audioInitialized = true;
        console.log('✅ Tone.js Piano ready!');
        return true;
        
    } catch (error) {
        console.error('❌ Tone.js init error:', error);
        alert('Audio-Initialisierung fehlgeschlagen. Bitte Seite neu laden.');
        return false;
    }
}

// Play single note
async function playToneNote(note, duration = 2.5) {
    try {
        if (!audioInitialized) {
            const success = await initToneJS();
            if (!success) return;
        }
        
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        pianoSampler.triggerAttackRelease(note, duration);
        console.log('♫ Playing:', note, duration + 's');
        
    } catch (error) {
        console.error('❌ Play error:', error);
    }
}

// Play multiple notes together (chord)
async function playToneChord(notes, duration = 3.0) {
    try {
        if (!audioInitialized) {
            const success = await initToneJS();
            if (!success) return;
        }
        
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        const now = Tone.now();
        notes.forEach(note => {
            pianoSampler.triggerAttackRelease(note, duration, now);
        });
        console.log('♫ Chord:', notes, duration + 's');
        
    } catch (error) {
        console.error('❌ Chord error:', error);
    }
}

// Schedule notes with precise timing
async function scheduleNotes(notesArray) {
    try {
        if (!audioInitialized) {
            const success = await initToneJS();
            if (!success) return;
        }
        
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        const now = Tone.now();
        
        notesArray.forEach(({notes, time, duration}) => {
            if (Array.isArray(notes)) {
                // Chord
                notes.forEach(note => {
                    pianoSampler.triggerAttackRelease(note, duration, now + time);
                });
            } else {
                // Single note
                pianoSampler.triggerAttackRelease(notes, duration, now + time);
            }
        });
        
        console.log('♫ Scheduled', notesArray.length, 'notes');
        
    } catch (error) {
        console.error('❌ Schedule error:', error);
    }
}

// Note frequency map
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

// Auto-initialize on load
console.log('🚀 Tone.js wird beim ersten Klick geladen...');

// Ensure audio starts on first interaction
let firstClick = true;
document.addEventListener('click', async () => {
    if (firstClick) {
        firstClick = false;
        console.log('👆 Erste Interaktion - starte Audio...');
        await initToneJS();
    }
}, { once: true });