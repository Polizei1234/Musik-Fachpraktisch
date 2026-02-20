// Professional Audio with Tone.js
// Mit Fallback auf Synth falls Sampler nicht funktioniert

let piano = null;
let audioInitialized = false;
let usingSynth = false;

// Initialize Tone.js Audio
async function initToneJS() {
    if (audioInitialized && piano) return true;
    
    console.log('🎹 Initializing Tone.js Audio...');
    
    try {
        // Start audio context
        await Tone.start();
        console.log('✅ AudioContext started, state:', Tone.context.state);
        
        // Try Piano Sampler first
        try {
            console.log('🎹 Trying Piano Sampler...');
            piano = new Tone.Sampler({
                urls: {
                    'C4': 'C4.mp3',
                    'D#4': 'Ds4.mp3',
                    'F#4': 'Fs4.mp3',
                    'A4': 'A4.mp3',
                },
                release: 3,
                baseUrl: 'https://tonejs.github.io/audio/salamander/'
            }).toDestination();
            
            console.log('⏳ Loading samples...');
            await Tone.loaded();
            console.log('✅ Piano Sampler loaded!');
            usingSynth = false;
            
        } catch (samplerError) {
            console.warn('⚠️ Sampler failed, using Synth:', samplerError);
            
            // Fallback: Use Synth (sounds like piano-ish)
            piano = new Tone.PolySynth(Tone.Synth, {
                oscillator: {
                    type: 'triangle'
                },
                envelope: {
                    attack: 0.005,
                    decay: 0.3,
                    sustain: 0.4,
                    release: 2
                }
            }).toDestination();
            
            console.log('✅ Synth ready (fallback mode)');
            usingSynth = true;
        }
        
        audioInitialized = true;
        console.log('✅ Audio ready! Using:', usingSynth ? 'Synth' : 'Piano Sampler');
        return true;
        
    } catch (error) {
        console.error('❌ Audio init error:', error);
        alert('Audio-Initialisierung fehlgeschlagen. Bitte Seite neu laden.');
        return false;
    }
}

// Play single note
async function playToneNote(note, duration = 2.5) {
    try {
        if (!audioInitialized) {
            console.log('🔄 Initializing audio...');
            const success = await initToneJS();
            if (!success) return;
        }
        
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        console.log('♫ Playing note:', note, duration + 's');
        piano.triggerAttackRelease(note, duration);
        
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
        
        console.log('♫ Playing chord:', notes, duration + 's');
        const now = Tone.now();
        notes.forEach(note => {
            piano.triggerAttackRelease(note, duration, now);
        });
        
    } catch (error) {
        console.error('❌ Chord error:', error);
    }
}

// Schedule notes with precise timing
async function scheduleNotes(notesArray) {
    try {
        if (!audioInitialized) {
            console.log('🔄 Initializing audio for scheduling...');
            const success = await initToneJS();
            if (!success) return;
        }
        
        if (Tone.context.state !== 'running') {
            await Tone.start();
        }
        
        const now = Tone.now();
        console.log('📅 Scheduling', notesArray.length, 'events starting at', now);
        
        notesArray.forEach(({notes, time, duration}, index) => {
            const scheduleTime = now + time;
            
            if (Array.isArray(notes)) {
                // Chord
                console.log(`  ${index+1}. Chord at +${time}s:`, notes);
                notes.forEach(note => {
                    piano.triggerAttackRelease(note, duration, scheduleTime);
                });
            } else {
                // Single note
                console.log(`  ${index+1}. Note at +${time}s:`, notes);
                piano.triggerAttackRelease(notes, duration, scheduleTime);
            }
        });
        
        console.log('✅ All notes scheduled!');
        
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

// Test audio on first click
console.log('🚀 Tone.js bereit - Audio startet beim ersten Klick');

let firstClick = true;
document.addEventListener('click', async () => {
    if (firstClick) {
        firstClick = false;
        console.log('👆 Erste Interaktion erkannt - initialisiere Audio...');
        await initToneJS();
        
        // Test-Ton
        console.log('🔊 Test-Ton...');
        await playToneNote('C4', 0.5);
    }
}, { once: true });