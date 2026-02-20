// Rhythmusdiktat nach echten BW-Abitur Richtlinien
// 4 Takte, 4/4-Takt, machbare Kombinationen
// Tempo: Viertel = ca. 60
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
    
    // Generate 4 bars - REALISTISCHE ABITUR-RHYTHMEN
    const bars = [
        generateRealisticBar(),
        generateRealisticBar(),
        generateRealisticBar(),
        generateRealisticBar()
    ];
    
    // Flatten for playback
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

function generateRealisticBar() {
    // REALISTISCHE Abitur-Rhythmen aus echten Prüfungen
    const patterns = [
        // Einfache Viertel/Achtel Kombinationen
        [
            {duration: 1, note: 'q'},      // Viertel
            {duration: 1, note: 'q'},      // Viertel
            {duration: 0.5, note: '8'},    // Achtel
            {duration: 0.5, note: '8'},    // Achtel
            {duration: 1, note: 'q'}       // Viertel
        ],
        [
            {duration: 0.5, note: '8'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},
            {duration: 0.5, note: '8'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 1, note: 'q'},
            {duration: 0.5, note: '8'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        
        // Punktierungen (einfach)
        [
            {duration: 1.5, note: 'qd'},   // Punktierte Viertel
            {duration: 0.5, note: '8'},    // Achtel
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 1, note: 'q'},
            {duration: 1.5, note: 'qd'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 0.75, note: '8d'},  // Punktierte Achtel
            {duration: 0.25, note: '16'},  // Sechzehntel
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        
        // Einfache Synkopen
        [
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},      // Synkope!
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 1, note: 'q'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},      // Synkope!
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'}
        ],
        
        // Triolen (einfach)
        [
            {duration: 1/3, note: '8t', isTriplet: true},
            {duration: 1/3, note: '8t', isTriplet: true},
            {duration: 1/3, note: '8t', isTriplet: true},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 1, note: 'q'},
            {duration: 2/3, note: 'qt', isTriplet: true},
            {duration: 2/3, note: 'qt', isTriplet: true},
            {duration: 2/3, note: 'qt', isTriplet: true},
            {duration: 1, note: 'q'}
        ],
        
        // Sechzehntel (einfache Gruppen)
        [
            {duration: 0.25, note: '16'},
            {duration: 0.25, note: '16'},
            {duration: 0.25, note: '16'},
            {duration: 0.25, note: '16'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 1, note: 'q'},
            {duration: 0.25, note: '16'},
            {duration: 0.25, note: '16'},
            {duration: 0.5, note: '8'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        
        // Pausen eingebaut
        [
            {duration: 1, note: 'q'},
            {duration: 1, note: 'qr', isRest: true},  // Viertelpause
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
        ],
        [
            {duration: 0.5, note: '8'},
            {duration: 0.5, note: '8r', isRest: true},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'},
            {duration: 1, note: 'q'}
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
    feedback.textContent = '✅ Hier ist die Lösung! Vergleiche mit deiner Notation.';
    feedback.className = 'feedback show correct';
    
    // JETZT MIT ECHTER NOTATION!
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
        
        // Create 4 staves (one per bar)
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
        
        // Draw each bar
        bars.forEach((bar, barIndex) => {
            const vexNotes = [];
            
            bar.forEach(noteObj => {
                let duration = noteObj.note;
                
                // Pausen
                if (noteObj.isRest) {
                    duration += 'r';
                }
                
                const staveNote = new VF.StaveNote({
                    clef: 'percussion',
                    keys: ['b/4'],
                    duration: duration
                });
                
                // Punkte für punktierte Noten
                if (duration.includes('d')) {
                    staveNote.addModifier(new VF.Dot(), 0);
                }
                
                vexNotes.push(staveNote);
            });
            
            // Triolen gruppieren
            let triplets = [];
            vexNotes.forEach((note, idx) => {
                if (bar[idx] && bar[idx].isTriplet) {
                    triplets.push(note);
                    if (triplets.length === 3) {
                        const tuplet = new VF.Tuplet(triplets);
                        tuplets = [];
                    }
                }
            });
            
            const voice = new VF.Voice({num_beats: 4, beat_value: 4});
            voice.addTickables(vexNotes);
            
            new VF.Formatter()
                .joinVoices([voice])
                .format([voice], staveWidth - 20);
            
            voice.draw(context, staves[barIndex]);
        });
        
        console.log('✅ Rhythm notation displayed!');
        
    } catch (error) {
        console.error('❌ Error displaying rhythm notation:', error);
        element.innerHTML = '<p style="text-align: center; padding: 60px; color: #e74c3c;">' +
            '<strong>Fehler bei der Notendarstellung</strong><br><br>' +
            'Die Rhythmus-Lösung konnte nicht angezeigt werden.<br>' +
            'Bitte vergleiche deine handschriftliche Lösung mit dem gehörten Rhythmus.</p>';
    }
}