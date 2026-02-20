// Rhythmusdiktat nach OFFIZIELLEN BW-Abitur Richtlinien
// Quelle: Ministerium für Kultus Baden-Württemberg
// 4 Takte, 4/4-Takt
// Notenwerte: Viertel, Achtel, Sechzehntel
// KEINE Pausenwerte!
// Tempo: Viertel = ca. 60 BPM
// Diktiermodus: 1-4, dann 1, 1, 1+2, 2, 2+3, 3, 3+4, 4, 4, 1-4

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
    
    // Generate 4 bars - AUTHENTIC ABITUR PATTERNS
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
    // ECHTE Abitur-Rhythmen nach BW-Vorgaben
    // Nur Viertel, Achtel, Sechzehntel - KEINE PAUSEN!
    const patterns = [
        // === EINFACH: Viertel + Achtel ===
        [
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        
        // === MITTEL: Punktierungen (typisch Abitur!) ===
        [
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1.5, n: 'qd'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 1.5, n: 'qd'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'}
        ],
        
        // === SYNKOPEN (sehr beliebt im Abitur!) ===
        [
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},   // Synkope!
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},   // Synkope!
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'}
        ],
        
        // === SECHZEHNTEL (klassische Abitur-Muster) ===
        [
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.5, n: '8'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 1, n: 'q'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'}
        ],
        
        // === KOMBINIERT (anspruchsvoll) ===
        [
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        
        // === MIT SYNKOPEN + SECHZEHNTEL ===
        [
            {d: 0.5, n: '8'},
            {d: 0.75, n: '8d'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 1, n: 'q'}
        ],
        [
            {d: 0.25, n: '16'},
            {d: 0.25, n: '16'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'},
            {d: 0.5, n: '8'},
            {d: 0.5, n: '8'},
            {d: 1, n: 'q'}
        ]
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

async function playCountIn() {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        await ctx.resume();
    }
    
    const now = ctx.currentTime;
    const beatDuration = 1.0; // 60 BPM
    
    for (let i = 0; i < 4; i++) {
        const startTime = now + (i * beatDuration);
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
    
    await new Promise(resolve => setTimeout(resolve, beatDuration * 4 * 1000));
}

async function playRhythmus() {
    if (!currentRhythmus) return;
    
    const playBtn = document.getElementById('play-rhythmus');
    const continueBtn = document.getElementById('continue-rhythmus');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        rhythmusPlaybackStep = 0;
        await playCountIn();
        await new Promise(resolve => setTimeout(resolve, 200));
        await playRhythmPattern(currentRhythmus.pattern, 'C4');
        
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
            
            // Count-in "drei, vier"
            const ctx = getAudioContext();
            const now = ctx.currentTime;
            const beatDuration = 1.0;
            
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
            await playRhythmPattern(notesToPlay, 'C4');
            
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
        
        // Create 4 staves
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
        
        // Draw each bar with proper beaming
        bars.forEach((bar, barIndex) => {
            const vexNotes = [];
            
            bar.forEach(noteObj => {
                const staveNote = new VF.StaveNote({
                    clef: 'percussion',
                    keys: ['b/4'],
                    duration: noteObj.n
                });
                
                // Dots for dotted notes
                if (noteObj.n.includes('d')) {
                    VF.Dot.buildAndAttach([staveNote]);
                }
                
                vexNotes.push(staveNote);
            });
            
            // Auto-beam eighth and sixteenth notes
            const beams = VF.Beam.generateBeams(vexNotes, {
                beam_rests: false
            });
            
            const voice = new VF.Voice({num_beats: 4, beat_value: 4});
            voice.addTickables(vexNotes);
            
            new VF.Formatter()
                .joinVoices([voice])
                .format([voice], staveWidth - 30);
            
            voice.draw(context, staves[barIndex]);
            
            // Draw beams
            beams.forEach(beam => beam.setContext(context).draw());
        });
        
        console.log('✅ Rhythm notation with beaming displayed!');
        
    } catch (error) {
        console.error('❌ Error displaying rhythm:', error);
        element.innerHTML = '<p style="text-align: center; padding: 60px; color: #e74c3c;">' +
            '<strong>Fehler bei der Notendarstellung</strong><br><br>' +
            'Bitte lade die Seite neu.</p>';
    }
}