// Akkord-Übung nach BW-Richtlinien
// 9 Akkorde: D, M, ü, D7, Dmaj7, M7, v7, D5/6, M5/6
// 4-stimmig, Grundstellung, enge Lage
// Tonraum: g bis c3 (G3 bis C6)
// Diktiermodus: Kontinuierlicher Loop ohne Pausen (BPM=60)

const akkorde = [
    { name: 'Durdreiklang', short: 'D', intervals: [0, 4, 7, 12] },
    { name: 'Molldreiklang', short: 'M', intervals: [0, 3, 7, 12] },
    { name: 'Übermäßiger Dreiklang', short: 'ü', intervals: [0, 4, 8, 12] },
    { name: 'D7', short: 'D7', intervals: [0, 4, 7, 10] },
    { name: 'Dmaj7', short: 'Dmaj7', intervals: [0, 4, 7, 11] },
    { name: 'M7', short: 'M7', intervals: [0, 3, 7, 10] },
    { name: 'v7', short: 'v7', intervals: [0, 3, 6, 10] },
    { name: 'D56', short: 'D5/6', intervals: [0, 4, 7, 9] },
    { name: 'M56', short: 'M5/6', intervals: [0, 3, 7, 9] }
];

let currentAkkord = null;
let akkordStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayedAkkord = false;

function initAkkorde() {
    akkordStats = { correct: 0, wrong: 0, total: 0 };
    updateAkkordStats();
    generateNewAkkord();
}

function generateNewAkkord() {
    hasPlayedAkkord = false;
    
    const akkord = akkorde[Math.floor(Math.random() * akkorde.length)];
    
    const minIndex = allNotes.indexOf('G3');
    const maxIndex = allNotes.indexOf('C4');
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const rootNote = allNotes[randomIndex];
    
    const notes = akkord.intervals.map(interval => getNoteByInterval(rootNote, interval));
    
    if (notes.some(note => !note || allNotes.indexOf(note) > allNotes.indexOf('C6'))) {
        generateNewAkkord();
        return;
    }
    
    currentAkkord = {
        name: akkord.name,
        short: akkord.short,
        rootNote: rootNote,
        notes: notes,
        intervals: akkord.intervals
    };
    
    console.log('Generated chord:', currentAkkord.short, '- notes:', notes);
    
    clearNotation('notation-akkord');
    
    document.getElementById('akkord-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('akkord-feedback').textContent = '';
    document.getElementById('next-akkord').style.display = 'none';
    document.getElementById('akkord-answer-section').style.display = 'none';
    document.getElementById('play-akkord').disabled = false;
    document.getElementById('replay-akkord').disabled = true;
    
    document.querySelectorAll('#akkord-answer-section .answer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

async function playAkkord() {
    if (!currentAkkord) return;
    
    if (typeof unlockAudio === 'function') {
        await unlockAudio();
    }
    
    const playBtn = document.getElementById('play-akkord');
    const replayBtn = document.getElementById('replay-akkord');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    console.log('Playing chord seamlessly (BPM=60):', currentAkkord.notes);
    
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        
        // BPM = 60 -> 1 Viertelnote = 1 Sekunde
        const beatDuration = 1.0;
        let startTime = ctx.currentTime + 0.05;
        
        // Play each note seamlessly (no gaps)
        for (let i = 0; i < currentAkkord.notes.length; i++) {
            const note = currentAkkord.notes[i];
            console.log(`Note ${i+1} starts at ${startTime}`);
            
            await playPianoSample(note, startTime, beatDuration);
            
            // Next note starts exactly when previous ends
            startTime += beatDuration;
        }
        
        // Short pause before chord
        startTime += 0.3;
        
        // Play all notes together
        console.log('Chord starts at', startTime);
        for (const note of currentAkkord.notes) {
            await playPianoSample(note, startTime, 1.5);
        }
        
        // Wait for everything to finish (4s individual + 0.3s pause + 1.5s chord)
        await new Promise(resolve => setTimeout(resolve, 5800));
        
    } catch (error) {
        console.error('Error playing chord:', error);
    }
    
    if (!hasPlayedAkkord) {
        document.getElementById('akkord-answer-section').style.display = 'block';
        hasPlayedAkkord = true;
    }
    
    playBtn.disabled = false;
    replayBtn.disabled = false;
}

function checkAkkord(answer) {
    if (!hasPlayedAkkord) return;
    
    const feedback = document.getElementById('akkord-feedback');
    const buttons = document.querySelectorAll('#akkord-answer-section .answer-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    akkordStats.total++;
    
    const isCorrect = (answer === currentAkkord.name);
    
    if (isCorrect) {
        akkordStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentAkkord.short}.`;
        feedback.className = 'feedback show correct';
        
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('correct');
            }
        });
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentAkkord.short}, nicht ${getAkkordShort(answer)}.`;
        feedback.className = 'feedback show wrong';
        
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('wrong');
            }
            if (btn.textContent.includes(currentAkkord.name)) {
                btn.classList.add('correct');
            }
        });
    }
    
    displayChord('notation-akkord', currentAkkord.notes);
    updateAkkordStats();
    
    document.getElementById('next-akkord').style.display = 'block';
}

function getAkkordShort(fullName) {
    const akkord = akkorde.find(a => a.name === fullName);
    return akkord ? akkord.short : fullName;
}

function nextAkkord() {
    generateNewAkkord();
}

function updateAkkordStats() {
    document.getElementById('akkord-correct').textContent = akkordStats.correct;
    document.getElementById('akkord-wrong').textContent = akkordStats.wrong;
    document.getElementById('akkord-total').textContent = akkordStats.total;
}