// Rhythmusdiktat nach OFFIZIELLEN BW-Abitur Richtlinien
// Mit ECHTEM PIANO-SOUND wie musictheory.net
// 4 Takte, 4/4-Takt, Viertel/Achtel/Sechzehntel, KEINE Pausen
// Tempo: Viertel = ca. 60 BPM

let currentRhythmus = null;
let rhythmusStats = { total: 0 };
let rhythmusPlaybackStep = 0;

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
    rhythmusStats = { total: 0 };
    updateRhythmusStats();
    generateNewRhythmus();
}

function generateNewRhythmus() {
    rhythmusPlaybackStep = 0;
    
    const bars = [
        generateAbiturBar(),
        generateAbiturBar(),
        generateAbiturBar(),
        generateAbiturBar()
    ];
    
    let pattern = [];
    bars.forEach(bar => {
        pattern = pattern.concat(bar);
    });
    
    currentRhythmus = {
        bars: bars,
        pattern: pattern
    };
    
    clearNotation('notation-rhythmus');
    
    document.getElementById('rhythmus-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('rhythmus-feedback').textContent = '';
    document.getElementById('show-rhythmus-solution').style.display = 'none';
    document.getElementById('next-rhythmus').style.display = 'none';
    document.getElementById('play-rhythmus').disabled = false;
    document.getElementById('continue-rhythmus').style.display = 'none';
}

function generateAbiturBar() {
    const patterns = [
        // Einfach: Viertel + Achtel
        [{d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        
        // Punktierungen
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1.5, n: 'qd'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 1.5, n: 'qd'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}],
        
        // Synkopen
        [{d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}],
        
        // Sechzehntel
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 1, n: 'q'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}],
        
        // Kombiniert
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}]
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

// PIANO COUNT-IN wie musictheory.net!
async function playCountIn() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    const beatDuration = 1.0; // 60 BPM
    const now = ctx.currentTime;
    
    // Play 4 piano clicks (C5 for emphasis)
    for (let i = 0; i < 4; i++) {
        const startTime = now + (i * beatDuration);
        const pitch = i === 0 ? 'C5' : 'C4'; // First beat higher
        await playPianoSample(pitch, startTime, 0.15);
    }
    
    await new Promise(resolve => setTimeout(resolve, beatDuration * 4 * 1000));
}

async function playRhythmus() {
    if (!currentRhythmus) return;
    
    const playBtn = document.getElementById('play-rhythmus');
    const continueBtn = document.getElementById('continue-rhythmus');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        if (!audioUnlocked) await unlockAudio();
        
        rhythmusPlaybackStep = 0;
        await playCountIn();
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Play rhythm with PIANO (C4)
        await playRhythmPatternPiano(currentRhythmus.pattern, 'C4');
        
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
            
            let notesToPlay = [];
            step.bars.forEach(barIndex => {
                notesToPlay = notesToPlay.concat(currentRhythmus.bars[barIndex]);
            });
            
            // Piano count-in (2 beats)
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const beatDuration = 1.0;
            
            for (let i = 0; i < 2; i++) {
                const startTime = now + (i * beatDuration);
                await playPianoSample('C4', startTime, 0.15);
            }
            
            await new Promise(resolve => setTimeout(resolve, beatDuration * 2 * 1000 + 200));
            await playRhythmPatternPiano(notesToPlay, 'C4');
            
            rhythmusPlaybackStep++;
            
            if (rhythmusPlaybackStep < diktierSteps.length) {
                continueBtn.textContent = diktierSteps[rhythmusPlaybackStep].label + ' ▶';
            } else {
                continueBtn.style.display = 'none';
                document.getElementById('show-rhythmus-solution').style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error continuing rhythm:', error);
    }
    
    continueBtn.disabled = false;
}

// Play rhythm with REAL PIANO SOUND
async function playRhythmPatternPiano(pattern, pitch = 'C4') {
    console.log('▶ Playing rhythm with piano');
    
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const beatDuration = 1.0; // 60 BPM
    let currentTime = ctx.currentTime + 0.05;
    
    for (const noteObj of pattern) {
        if (noteObj.d > 0) {
            // Play piano sample for each note
            const noteDuration = noteObj.d * beatDuration;
            await playPianoSample(pitch, currentTime, noteDuration * 0.9);
        }
        currentTime += noteObj.d * beatDuration;
    }
    
    const totalDuration = (currentTime - ctx.currentTime) * 1000;
    await new Promise(r => setTimeout(r, totalDuration + 100));
    console.log('✓ Rhythm complete');
}

function showRhythmusSolution() {
    rhythmusStats.total++;
    updateRhythmusStats();
    
    const feedback = document.getElementById('rhythmus-feedback');
    feedback.textContent = '✅ Hier ist die Lösung! Vergleiche Takt für Takt.';
    feedback.className = 'feedback show correct';
    
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
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(900, 250);
        const context = renderer.getContext();
        
        const staves = [];
        const yPos = 40;
        const staveWidth = 200;
        
        for (let i = 0; i < 4; i++) {
            const xPos = 10 + (i * (staveWidth + 20));
            const stave = new VF.Stave(xPos, yPos, staveWidth);
            
            if (i === 0) {
                stave.addClef('percussion');
                stave.addTimeSignature('4/4');
            }
            
            stave.setContext(context).draw();
            staves.push(stave);
        }
        
        bars.forEach((bar, barIndex) => {
            const vexNotes = [];
            
            bar.forEach(noteObj => {
                const staveNote = new VF.StaveNote({
                    clef: 'percussion',
                    keys: ['b/4'],
                    duration: noteObj.n
                });
                
                if (noteObj.n.includes('d')) {
                    VF.Dot.buildAndAttach([staveNote]);
                }
                
                vexNotes.push(staveNote);
            });
            
            const beams = VF.Beam.generateBeams(vexNotes, {
                beam_rests: false
            });
            
            const voice = new VF.Voice({num_beats: 4, beat_value: 4});
            voice.addTickables(vexNotes);
            
            new VF.Formatter()
                .joinVoices([voice])
                .format([voice], staveWidth - 30);
            
            voice.draw(context, staves[barIndex]);
            beams.forEach(beam => beam.setContext(context).draw());
        });
        
        console.log('✅ Notation displayed!');
        
    } catch (error) {
        console.error('❌ Notation error:', error);
        element.innerHTML = '<p style="text-align: center; padding: 60px; color: #e74c3c;">' +
            '<strong>Fehler bei der Notendarstellung</strong><br><br>' +
            'Bitte lade die Seite neu.</p>';
    }
}