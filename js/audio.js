// Real piano samples with preloading
let audioContext = null;
let audioUnlocked = false;
const pianoSamples = {};
const SAMPLE_PATH = 'audio/acoustic_grand_piano-mp3/';

// Map enharmonic notes
const noteToSampleFile = {
    'C#': 'Db', 'D#': 'Eb', 'F#': 'Gb', 'G#': 'Ab', 'A#': 'Bb'
};

function getSampleFilename(noteName) {
    const match = noteName.match(/([A-G]#?)([0-9])/);
    if (!match) return null;
    
    let note = match[1];
    const octave = match[2];
    
    if (note.includes('#')) {
        note = noteToSampleFile[note] || note;
    }
    
    return `${note}${octave}.mp3`;
}

// Load piano sample
async function loadPianoSample(noteName) {
    if (pianoSamples[noteName]) {
        return pianoSamples[noteName];
    }
    
    const filename = getSampleFilename(noteName);
    if (!filename) {
        console.error('❌ Unknown note:', noteName);
        return null;
    }
    
    const ctx = getAudioContext();
    if (!ctx) return null;
    
    try {
        const response = await fetch(SAMPLE_PATH + filename);
        if (!response.ok) {
            console.warn(`⚠️ Sample not found: ${filename}`);
            return null;
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
        
        pianoSamples[noteName] = audioBuffer;
        return audioBuffer;
    } catch (e) {
        console.error(`❌ Error loading ${filename}:`, e.message);
        return null;
    }
}

// Unlock audio
async function unlockAudio() {
    if (audioUnlocked) return true;
    
    try {
        const ctx = getAudioContext();
        if (!ctx) return false;
        
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
        
        // Play silent tone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = 440;
        gain.gain.value = 0.01;
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
        
        await new Promise(r => setTimeout(r, 150));
        
        audioUnlocked = true;
        console.log('✅ Audio unlocked!');
        return true;
    } catch (e) {
        console.error('❌ Unlock failed:', e);
        return false;
    }
}

// Initialize audio
function initAudio() {
    if (audioContext) return audioContext;
    
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        console.log('✅ AudioContext created');
        return audioContext;
    } catch (e) {
        console.error('❌ Audio init failed:', e);
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

// Play piano sample with LONGER duration
async function playPianoSample(noteName, startTime, duration) {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const audioBuffer = await loadPianoSample(noteName);
        if (!audioBuffer) {
            console.warn('⚠️ Using fallback synth');
            playPianoToneFallback(noteFrequencies[noteName], startTime, duration);
            return;
        }
        
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        
        source.buffer = audioBuffer;
        
        // Natural piano decay - longer sustain
        gainNode.gain.setValueAtTime(0.9, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + Math.min(duration, audioBuffer.duration));
        
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        source.start(startTime);
        source.stop(startTime + Math.min(duration + 0.2, audioBuffer.duration));
        
        console.log('♫', noteName);
    } catch (e) {
        console.error('❌ Play error:', e);
    }
}

// Fallback synthesizer
function playPianoToneFallback(frequency, startTime, duration) {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    try {
        const masterGain = ctx.createGain();
        const harmonics = [
            { mult: 1.0, gain: 1.0 },
            { mult: 2.0, gain: 0.4 },
            { mult: 3.0, gain: 0.2 },
            { mult: 4.0, gain: 0.15 }
        ];
        
        harmonics.forEach(h => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = frequency * h.mult;
            gain.gain.value = h.gain * 0.2;
            osc.connect(gain);
            gain.connect(masterGain);
            osc.start(startTime);
            osc.stop(startTime + duration + 0.1);
        });
        
        masterGain.gain.setValueAtTime(0, startTime);
        masterGain.gain.linearRampToValueAtTime(1.0, startTime + 0.002);
        masterGain.gain.linearRampToValueAtTime(0.2, startTime + 0.15);
        masterGain.gain.linearRampToValueAtTime(0.0, startTime + duration);
        masterGain.connect(ctx.destination);
    } catch (e) {
        console.error('❌ Fallback error:', e);
    }
}

// Play single note - LONGER DURATION (was 0.5, now 1.0)
async function playNote(noteName, duration = 1.0) {
    if (!audioUnlocked) await unlockAudio();
    if (!noteFrequencies[noteName]) {
        console.error('❌ Unknown note:', noteName);
        return;
    }
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    await playPianoSample(noteName, ctx.currentTime, duration);
}

// Play sequence
async function playNoteSequence(notes, gap = 0.2) {
    console.log('▶ Sequence start');
    
    if (!audioUnlocked) {
        const unlocked = await unlockAudio();
        if (!unlocked) {
            console.error('❌ Audio locked');
            return;
        }
    }
    
    for (const note of notes) {
        if (typeof note === 'string') {
            await playNote(note, 1.0);
            await new Promise(r => setTimeout(r, (1.0 + gap) * 1000));
        } else if (Array.isArray(note)) {
            const promises = note.map(n => playNote(n, 1.2));
            await Promise.all(promises);
            await new Promise(r => setTimeout(r, (1.2 + gap) * 1000));
        }
    }
    
    console.log('✓ Done');
}

// Play rhythm
async function playRhythmPattern(pattern, pitch = 'C4') {
    console.log('▶ Rhythm');
    if (!audioUnlocked) await unlockAudio();
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const beatDuration = 1.0;
    let currentTime = ctx.currentTime + 0.05;
    
    for (const note of pattern) {
        if (note.duration > 0) {
            await playPianoSample(pitch, currentTime, note.duration * beatDuration * 0.8);
        }
        currentTime += note.duration * beatDuration;
    }
    
    const totalDuration = (currentTime - ctx.currentTime) * 1000;
    await new Promise(r => setTimeout(r, totalDuration));
    console.log('✓ Done');
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

// Preload all notes from G3 to G5 (Intervalle range)
async function preloadSamples() {
    console.log('🔄 Preloading piano samples...');
    const notesToPreload = [
        'G3', 'G#3', 'A3', 'A#3', 'B3',
        'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
        'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5'
    ];
    
    const promises = notesToPreload.map(note => loadPianoSample(note));
    await Promise.all(promises);
    console.log('✅ Samples preloaded!');
}

// Test
async function testAudio() {
    await unlockAudio();
    await playNote('C4', 1.0);
    setTimeout(() => playNote('E4', 1.0), 1200);
    setTimeout(() => playNote('G4', 1.0), 2400);
}