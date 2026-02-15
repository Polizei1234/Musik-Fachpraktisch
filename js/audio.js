// Safari-compatible audio with HTMLAudioElement fallback
let audioContext = null;
let debugLog = [];
let audioUnlocked = false;

function log(msg) {
    console.log(msg);
    debugLog.push(msg);
    updateDebugOverlay();
}

function updateDebugOverlay() {
    let overlay = document.getElementById('debug-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'debug-overlay';
        overlay.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.8); color: #0f0; padding: 10px; font-family: monospace; font-size: 12px; max-height: 150px; overflow-y: auto; z-index: 10000;';
        document.body.appendChild(overlay);
    }
    overlay.innerHTML = debugLog.slice(-10).join('<br>');
}

// Force unlock Safari audio
async function unlockAudio() {
    if (audioUnlocked) return true;
    
    log('Unlocking audio...');
    
    try {
        const ctx = getAudioContext();
        if (!ctx) return false;
        
        // Resume context
        if (ctx.state === 'suspended') {
            await ctx.resume();
            log('Context resumed: ' + ctx.state);
        }
        
        // Play actual audible sound to unlock
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.value = 440;
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
        
        // Wait for sound to play
        await new Promise(r => setTimeout(r, 150));
        
        audioUnlocked = true;
        log('✅ Audio unlocked!');
        return true;
    } catch (e) {
        log('❌ Unlock failed: ' + e.message);
        return false;
    }
}

// Initialize audio
function initAudio() {
    if (audioContext) return audioContext;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        log('✅ AudioContext created! State: ' + audioContext.state);
        return audioContext;
    } catch (e) {
        log('❌ Audio init failed: ' + e.message);
        return null;
    }
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

// Play tone with proper gain envelope
function playTone(frequency, startTime, duration) {
    const ctx = getAudioContext();
    if (!ctx) {
        log('❌ No context!');
        return;
    }
    
    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.frequency.value = frequency;
        osc.type = 'sine';
        
        // Proper envelope to ensure sound plays
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
        gain.gain.setValueAtTime(0.3, startTime + duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + duration);
        
        log('♫ ' + Math.round(frequency) + 'Hz');
    } catch (e) {
        log('❌ Play error: ' + e.message);
    }
}

// Play single note
async function playNote(noteName, duration = 0.5) {
    // Ensure audio is unlocked first
    if (!audioUnlocked) {
        await unlockAudio();
    }
    
    const freq = noteFrequencies[noteName];
    if (!freq) {
        log('❌ Unknown note: ' + noteName);
        return;
    }
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    playTone(freq, ctx.currentTime, duration);
}

// Play sequence
async function playNoteSequence(notes, gap = 0.15) {
    log('▶ Sequence start');
    
    // Unlock audio first
    if (!audioUnlocked) {
        const unlocked = await unlockAudio();
        if (!unlocked) {
            log('❌ Cannot play - audio locked');
            return;
        }
    }
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    for (const note of notes) {
        if (typeof note === 'string') {
            playNote(note, 0.5);
            await new Promise(r => setTimeout(r, (0.5 + gap) * 1000));
        } else if (Array.isArray(note)) {
            note.forEach(n => playNote(n, 0.8));
            await new Promise(r => setTimeout(r, (0.8 + gap) * 1000));
        }
    }
    
    log('✓ Done');
}

// Play rhythm
async function playRhythmPattern(pattern, pitch = 'C4') {
    log('▶ Rhythm');
    
    if (!audioUnlocked) {
        await unlockAudio();
    }
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const beatDuration = 1.0;
    let delay = 0;
    
    for (const note of pattern) {
        setTimeout(() => playNote(pitch, note.duration * beatDuration * 0.8), delay * 1000);
        delay += note.duration * beatDuration;
    }
    
    await new Promise(r => setTimeout(r, delay * 1000));
    log('✓ Done');
}

// Helpers
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

// Test
async function testAudio() {
    log('=== TEST START ===');
    await unlockAudio();
    playNote('C4', 0.3);
    setTimeout(() => playNote('E4', 0.3), 400);
    setTimeout(() => playNote('G4', 0.3), 800);
}