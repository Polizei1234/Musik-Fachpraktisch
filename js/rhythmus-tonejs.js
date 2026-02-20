// Rhythmus mit Tone.js - KOMPLEXE ABITUR RHYTHMEN!
// Viel schwieriger und realistischer

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
        generateComplexBar(),
        generateComplexBar(),
        generateComplexBar(),
        generateComplexBar()
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

function generateComplexBar() {
    // KOMPLEXE ABITUR-RHYTHMEN - VIEL SCHWIERIGER!
    const patterns = [
        // === SECHZEHNTEL-LASTIG ===
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        
        // === PUNKTIERTE + SECHZEHNTEL KOMBOS ===
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        
        // === SYNKOPEN + SECHZEHNTEL ===
        [{d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        
        // === PUNKTIERTE VIERTEL + KOMPLEX ===
        [{d: 1.5, n: 'qd'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1.5, n: 'qd'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 1.5, n: 'qd'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1.5, n: 'qd'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        
        // === SEHR KOMPLEX ===
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}],
        [{d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}],
        [{d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}],
        
        // === DOPPEL-SYNKOPEN ===
        [{d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}],
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 0.5, n: '8'}],
        
        // === TRIPLE THREAT ===
        [{d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}],
        [{d: 0.5, n: '8'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}, {d: 0.25, n: '16'}, {d: 0.5, n: '8'}, {d: 0.75, n: '8d'}, {d: 0.25, n: '16'}],
        
        // === NUR FALLS ES ZU SCHWER WIRD ===
        [{d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}],
        [{d: 1, n: 'q'}, {d: 0.5, n: '8'}, {d: 0.5, n: '8'}, {d: 1, n: 'q'}, {d: 1, n: 'q'}]
    ];
    
    return patterns[Math.floor(Math.random() * patterns.length)];
}

async function playCountIn() {
    const schedule = [
        { notes: 'C5', time: 0, duration: 0.15 },
        { notes: 'C4', time: 1, duration: 0.15 },
        { notes: 'C4', time: 2, duration: 0.15 },
        { notes: 'C4', time: 3, duration: 0.15 }
    ];
    
    await scheduleNotes(schedule);
    await new Promise(r => setTimeout(r, 4000));
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
        await new Promise(r => setTimeout(r, 200));
        await playRhythmPattern(currentRhythmus.pattern);
        
        rhythmusPlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = diktierSteps[rhythmusPlaybackStep].label + ' ▶';
        
    } catch (error) {
        console.error('Error:', error);
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
            
            await scheduleNotes([
                { notes: 'C4', time: 0, duration: 0.15 },
                { notes: 'C4', time: 1, duration: 0.15 }
            ]);
            
            await new Promise(r => setTimeout(r, 2200));
            await playRhythmPattern(notesToPlay);
            
            rhythmusPlaybackStep++;
            
            if (rhythmusPlaybackStep < diktierSteps.length) {
                continueBtn.textContent = diktierSteps[rhythmusPlaybackStep].label + ' ▶';
            } else {
                continueBtn.style.display = 'none';
                document.getElementById('show-rhythmus-solution').style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    continueBtn.disabled = false;
}

async function playRhythmPattern(pattern) {
    const schedule = [];
    let time = 0;
    
    pattern.forEach(noteObj => {
        if (noteObj.d > 0) {
            schedule.push({
                notes: 'C4',
                time: time,
                duration: noteObj.d * 0.9
            });
        }
        time += noteObj.d;
    });
    
    await scheduleNotes(schedule);
    await new Promise(r => setTimeout(r, time * 1000 + 100));
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
            
            bar.forEach((noteObj) => {
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
            
            const beams = VF.Beam.generateBeams(vexNotes, { beam_rests: false });
            const voice = new VF.Voice({num_beats: 4, beat_value: 4});
            voice.addTickables(vexNotes);
            
            new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 30);
            voice.draw(context, staves[barIndex]);
            beams.forEach(beam => beam.setContext(context).draw());
        });
        
        console.log('✅ Complex rhythm notation displayed');
        
    } catch (error) {
        console.error('❌ Notation error:', error);
        element.innerHTML = '<p style="text-align: center; padding: 60px; color: #e74c3c;">' +
            'Fehler bei der Notendarstellung. Bitte lade die Seite neu.</p>';
    }
}