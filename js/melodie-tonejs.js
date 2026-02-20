// Melodiediktat mit Tone.js - BW-ABITUR VORGABEN
// 4 Takte, Ambitus > Oktave, leitereigene Töne, Kadenz

let currentMelodie = null;
let melodieStats = { total: 0 };
let melodiePlaybackStep = 0;

const melodieDiktierSteps = [
    { label: 'Kadenz + Takt 1-4', type: 'full', bars: [0, 1, 2, 3] },
    { label: 'Takt 1', type: 'bar', bars: [0] },
    { label: 'Takt 1', type: 'bar', bars: [0] },
    { label: 'Takt 1+2', type: 'bars', bars: [0, 1] },
    { label: 'Takt 2', type: 'bar', bars: [1] },
    { label: 'Takt 2+3', type: 'bars', bars: [1, 2] },
    { label: 'Takt 3', type: 'bar', bars: [2] },
    { label: 'Takt 3+4', type: 'bars', bars: [2, 3] },
    { label: 'Takt 4', type: 'bar', bars: [3] },
    { label: 'Takt 4', type: 'bar', bars: [3] },
    { label: 'Takt 1-4', type: 'melody', bars: [0, 1, 2, 3] }
];

// Tonarten (bis 3 Vorzeichen)
const tonarten = [
    { name: 'C-Dur', root: 'C4', scale: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], mode: 'major' },
    { name: 'G-Dur', root: 'G3', scale: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], mode: 'major' },
    { name: 'D-Dur', root: 'D4', scale: ['D', 'E', 'F#', 'G', 'A', 'B', 'C#'], mode: 'major' },
    { name: 'F-Dur', root: 'F3', scale: ['F', 'G', 'A', 'Bb', 'C', 'D', 'E'], mode: 'major' },
    { name: 'Bb-Dur', root: 'Bb3', scale: ['Bb', 'C', 'D', 'Eb', 'F', 'G', 'A'], mode: 'major' },
    { name: 'A-Dur', root: 'A3', scale: ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#'], mode: 'major' },
    { name: 'a-Moll', root: 'A3', scale: ['A', 'B', 'C', 'D', 'E', 'F', 'G#'], mode: 'minor' },
    { name: 'e-Moll', root: 'E3', scale: ['E', 'F#', 'G', 'A', 'B', 'C', 'D#'], mode: 'minor' },
    { name: 'd-Moll', root: 'D3', scale: ['D', 'E', 'F', 'G', 'A', 'Bb', 'C#'], mode: 'minor' },
    { name: 'g-Moll', root: 'G3', scale: ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F#'], mode: 'minor' }
];

window.initMelodie = function() {
    melodieStats = { total: 0 };
    updateMelodieStats();
    generateNewMelodie();
};

function generateNewMelodie() {
    melodiePlaybackStep = 0;
    
    // Wähle zufällige Tonart
    const tonart = tonarten[Math.floor(Math.random() * tonarten.length)];
    
    // Erstelle 4-taktige Melodie
    const bars = [
        generateMelodieBar(tonart, 'start'),
        generateMelodieBar(tonart, 'middle'),
        generateMelodieBar(tonart, 'middle'),
        generateMelodieBar(tonart, 'end')
    ];
    
    // Überprüfe Ambitus (muss > Oktave sein)
    let allNotes = [];
    bars.forEach(bar => {
        bar.forEach(note => allNotes.push(note.note));
    });
    
    const ambitus = calculateAmbitus(allNotes);
    if (ambitus <= 12) {
        // Ambitus zu klein, nochmal generieren
        generateNewMelodie();
        return;
    }
    
    currentMelodie = {
        tonart: tonart,
        bars: bars,
        ambitus: ambitus
    };
    
    clearNotation('notation-melodie');
    document.getElementById('melodie-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('melodie-feedback').textContent = '';
    document.getElementById('show-melodie-solution').style.display = 'none';
    document.getElementById('next-melodie').style.display = 'none';
    document.getElementById('play-melodie').disabled = false;
    document.getElementById('continue-melodie').style.display = 'none';
    document.getElementById('melodie-info').textContent = `Tonart: ${tonart.name} | Ambitus: ${ambitus} Halbtöne (${Math.floor(ambitus/12)} Oktave${ambitus > 12 ? 'n' : ''})`;
}

function generateMelodieBar(tonart, position) {
    // Einfachere Patterns die genau 4 Schläge ergeben
    const patterns = [
        // Viertel = 4 Schläge
        [{d: 1, step: 0}, {d: 1, step: 1}, {d: 1, step: 2}, {d: 1, step: 1}],
        [{d: 1, step: 0}, {d: 1, step: 2}, {d: 1, step: 1}, {d: 1, step: 0}],
        [{d: 1, step: 0}, {d: 1, step: 1}, {d: 1, step: 0}, {d: 1, step: -1}],
        // Mit Halben = 4 Schläge
        [{d: 2, step: 0}, {d: 1, step: 1}, {d: 1, step: 2}],
        [{d: 1, step: 0}, {d: 1, step: 1}, {d: 2, step: 2}],
        [{d: 2, step: 0}, {d: 2, step: 2}],
        // Mit Achteln = 4 Schläge
        [{d: 0.5, step: 0}, {d: 0.5, step: 1}, {d: 1, step: 2}, {d: 1, step: 1}, {d: 1, step: 0}],
        [{d: 1, step: 0}, {d: 0.5, step: 1}, {d: 0.5, step: 2}, {d: 1, step: 1}, {d: 1, step: 0}],
        [{d: 1, step: 0}, {d: 1, step: 1}, {d: 0.5, step: 2}, {d: 0.5, step: 1}, {d: 1, step: 0}]
    ];
    
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];
    
    // Starte bei einem Skalenton (Oktave 3-4)
    let startOctave = 3 + Math.floor(Math.random() * 2);
    let currentScaleIndex = Math.floor(Math.random() * 5);
    
    // Für Endtakt: zurück zum Grundton
    if (position === 'end') {
        const lastPattern = [{d: 1, step: 1}, {d: 1, step: 0}, {d: 1, step: -1}, {d: 1, step: -2}];
        return createNotesFromPattern(lastPattern, tonart, currentScaleIndex, startOctave);
    }
    
    return createNotesFromPattern(pattern, tonart, currentScaleIndex, startOctave);
}

function createNotesFromPattern(pattern, tonart, startIndex, startOctave) {
    const notes = [];
    let currentIndex = startIndex;
    let currentOctave = startOctave;
    
    pattern.forEach(({d, step}) => {
        currentIndex += step;
        
        // Oktave anpassen wenn nötig
        while (currentIndex >= 7) {
            currentIndex -= 7;
            currentOctave++;
        }
        while (currentIndex < 0) {
            currentIndex += 7;
            currentOctave--;
        }
        
        // Begrenze auf Oktaven 3-5
        if (currentOctave < 3) currentOctave = 3;
        if (currentOctave > 5) currentOctave = 5;
        
        const noteName = tonart.scale[currentIndex] + currentOctave;
        
        notes.push({
            note: noteName,
            duration: d,
            vexDuration: d === 2 ? 'h' : d === 1 ? 'q' : d === 0.5 ? '8' : 'q'
        });
    });
    
    return notes;
}

function calculateAmbitus(notes) {
    const noteIndices = notes.map(note => {
        const match = note.match(/([A-G]#?)([0-9])/);
        if (!match) return 0;
        const noteName = match[1];
        const octave = parseInt(match[2]);
        
        const chromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        let index = chromatic.indexOf(noteName);
        if (index === -1 && noteName.includes('b')) {
            const flat = noteName.replace('b', '');
            index = chromatic.indexOf(flat) - 1;
            if (index < 0) index += 12;
        }
        
        return octave * 12 + index;
    });
    
    const min = Math.min(...noteIndices);
    const max = Math.max(...noteIndices);
    
    return max - min;
}

async function playKadenz(tonart) {
    const root = tonart.root;
    const mode = tonart.mode;
    
    let kadenz = [];
    
    if (mode === 'major') {
        const tonic = root;
        const subdominant = getNoteByInterval(root, 5);
        const dominant = getNoteByInterval(root, 7);
        
        kadenz = [
            { notes: [tonic, getNoteByInterval(tonic, 4), getNoteByInterval(tonic, 7)], time: 0, duration: 1.5 },
            { notes: [subdominant, getNoteByInterval(subdominant, 4), getNoteByInterval(subdominant, 7)], time: 1.5, duration: 1.5 },
            { notes: [dominant, getNoteByInterval(dominant, 4), getNoteByInterval(dominant, 7)], time: 3, duration: 1.5 },
            { notes: [tonic, getNoteByInterval(tonic, 4), getNoteByInterval(tonic, 7)], time: 4.5, duration: 2.0 }
        ];
    } else {
        const tonic = root;
        const subdominant = getNoteByInterval(root, 5);
        const dominant = getNoteByInterval(root, 7);
        
        kadenz = [
            { notes: [tonic, getNoteByInterval(tonic, 3), getNoteByInterval(tonic, 7)], time: 0, duration: 1.5 },
            { notes: [subdominant, getNoteByInterval(subdominant, 3), getNoteByInterval(subdominant, 7)], time: 1.5, duration: 1.5 },
            { notes: [dominant, getNoteByInterval(dominant, 4), getNoteByInterval(dominant, 7)], time: 3, duration: 1.5 },
            { notes: [tonic, getNoteByInterval(tonic, 3), getNoteByInterval(tonic, 7)], time: 4.5, duration: 2.0 }
        ];
    }
    
    await scheduleNotes(kadenz);
    await new Promise(r => setTimeout(r, 7000));
}

window.playMelodie = async function() {
    if (!currentMelodie) return;
    
    const playBtn = document.getElementById('play-melodie');
    const continueBtn = document.getElementById('continue-melodie');
    
    playBtn.disabled = true;
    continueBtn.disabled = true;
    
    try {
        melodiePlaybackStep = 0;
        
        console.log('🎵 Playing cadence...');
        await playKadenz(currentMelodie.tonart);
        await new Promise(r => setTimeout(r, 500));
        
        console.log('🎵 Playing melody...');
        await playMelodieBars(currentMelodie.bars);
        
        melodiePlaybackStep = 1;
        continueBtn.style.display = 'inline-block';
        continueBtn.disabled = false;
        continueBtn.textContent = melodieDiktierSteps[melodiePlaybackStep].label + ' ▶';
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    playBtn.disabled = false;
};

window.continueMelodie = async function() {
    if (!currentMelodie) return;
    
    const continueBtn = document.getElementById('continue-melodie');
    continueBtn.disabled = true;
    
    try {
        if (melodiePlaybackStep >= 1 && melodiePlaybackStep < melodieDiktierSteps.length) {
            const step = melodieDiktierSteps[melodiePlaybackStep];
            
            if (step.type === 'full') {
                await playKadenz(currentMelodie.tonart);
                await new Promise(r => setTimeout(r, 500));
            }
            
            await scheduleNotes([
                { notes: 'C5', time: 0, duration: 0.15 },
                { notes: 'C5', time: 1, duration: 0.15 }
            ]);
            await new Promise(r => setTimeout(r, 2200));
            
            let barsToPlay = [];
            step.bars.forEach(barIndex => {
                barsToPlay.push(currentMelodie.bars[barIndex]);
            });
            
            await playMelodieBars(barsToPlay);
            
            melodiePlaybackStep++;
            
            if (melodiePlaybackStep < melodieDiktierSteps.length) {
                continueBtn.textContent = melodieDiktierSteps[melodiePlaybackStep].label + ' ▶';
            } else {
                continueBtn.style.display = 'none';
                document.getElementById('show-melodie-solution').style.display = 'block';
            }
        }
        
    } catch (error) {
        console.error('Error:', error);
    }
    
    continueBtn.disabled = false;
};

async function playMelodieBars(bars) {
    const schedule = [];
    let time = 0;
    
    bars.forEach(bar => {
        bar.forEach(noteObj => {
            schedule.push({
                notes: noteObj.note,
                time: time,
                duration: noteObj.duration * 0.9
            });
            time += noteObj.duration;
        });
    });
    
    await scheduleNotes(schedule);
    await new Promise(r => setTimeout(r, time * 1000 + 200));
}

window.showMelodieSolution = function() {
    melodieStats.total++;
    updateMelodieStats();
    
    const feedback = document.getElementById('melodie-feedback');
    feedback.textContent = '✅ Hier ist die Lösung! Vergleiche Note für Note.';
    feedback.className = 'feedback show correct';
    
    displayMelodieNotation('notation-melodie', currentMelodie);
    
    document.getElementById('next-melodie').style.display = 'block';
    document.getElementById('show-melodie-solution').style.display = 'none';
};

window.nextMelodie = function() {
    generateNewMelodie();
};

function updateMelodieStats() {
    document.getElementById('melodie-total').textContent = melodieStats.total;
}

function displayMelodieNotation(elementId, melodie) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(900, 200);
        const context = renderer.getContext();
        
        const staveWidth = 210;
        const yPos = 40;
        
        // Rendere jeden Takt einzeln
        melodie.bars.forEach((bar, barIndex) => {
            const xPos = 10 + (barIndex * staveWidth);
            const stave = new VF.Stave(xPos, yPos, staveWidth);
            
            // Nur erster Takt bekommt Schlüssel, Takt und Tonart
            if (barIndex === 0) {
                stave.addClef('treble');
                stave.addTimeSignature('4/4');
                
                const keySignature = getKeySignature(melodie.tonart.name);
                if (keySignature) {
                    stave.addKeySignature(keySignature);
                }
            }
            
            stave.setContext(context).draw();
            
            // Erstelle Noten für diesen Takt
            const vexNotes = [];
            
            bar.forEach((noteObj) => {
                const key = noteToVexFlow(noteObj.note);
                
                const staveNote = new VF.StaveNote({
                    clef: 'treble',
                    keys: [key],
                    duration: noteObj.vexDuration
                });
                
                // Vorzeichen nur wenn nicht in Tonart-Signatur
                const needsAccidental = noteNeedsAccidental(noteObj.note, melodie.tonart);
                if (needsAccidental) {
                    if (noteObj.note.includes('#')) {
                        staveNote.addModifier(new VF.Accidental('#'), 0);
                    } else if (noteObj.note.includes('b')) {
                        staveNote.addModifier(new VF.Accidental('b'), 0);
                    }
                }
                
                vexNotes.push(staveNote);
            });
            
            // Balken für Achtel
            const beams = VF.Beam.generateBeams(vexNotes, { beam_rests: false });
            
            // Voice mit genau 4 Schlägen
            const voice = new VF.Voice({num_beats: 4, beat_value: 4});
            voice.addTickables(vexNotes);
            
            // Formatieren und zeichnen
            new VF.Formatter().joinVoices([voice]).format([voice], staveWidth - 30);
            voice.draw(context, stave);
            beams.forEach(beam => beam.setContext(context).draw());
        });
        
        console.log('✅ Melody notation displayed');
        
    } catch (error) {
        console.error('❌ Notation error:', error);
        element.innerHTML = '<p style="text-align: center; padding: 60px; color: #e74c3c;">' +
            'Fehler bei der Notendarstellung. Bitte lade die Seite neu.</p>';
    }
}

function noteNeedsAccidental(note, tonart) {
    // Check ob Note ein Vorzeichen hat das NICHT in der Tonart-Signatur ist
    const noteName = note.match(/([A-G]#?b?)/)[1];
    return !tonart.scale.includes(noteName.replace(/[0-9]/g, ''));
}

function getKeySignature(tonartName) {
    const signatures = {
        'C-Dur': 'C', 'a-Moll': 'Am',
        'G-Dur': 'G', 'e-Moll': 'Em',
        'D-Dur': 'D', 'A-Dur': 'A',
        'F-Dur': 'F', 'd-Moll': 'Dm',
        'Bb-Dur': 'Bb', 'g-Moll': 'Gm'
    };
    
    return signatures[tonartName] || 'C';
}

console.log('✅ Melodie module loaded');