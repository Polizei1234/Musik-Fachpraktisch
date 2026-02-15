// Akkord-Übung nach BW-Richtlinien
// Tonraum: g bis c3 (G3 bis C6)
// Grundstellung, enge Lage, stets vierstimmig
// Diktiermodus: Erst einzeln (nicht liegen lassen), dann zusammen (jeweils einmal)

const akkorde = [
    { 
        name: 'Durdreiklang', 
        short: 'D',
        intervals: [0, 4, 7, 12], // Grundton, Terz, Quinte, Oktave
        description: 'Durdreiklang + Oktave'
    },
    { 
        name: 'Molldreiklang', 
        short: 'M',
        intervals: [0, 3, 7, 12],
        description: 'Molldreiklang + Oktave'
    },
    { 
        name: 'Übermäßiger Dreiklang', 
        short: 'ü',
        intervals: [0, 4, 8, 12],
        description: 'Übermäßiger Dreiklang + Oktave'
    },
    { 
        name: 'D7', 
        short: 'D7',
        intervals: [0, 4, 7, 10],
        description: 'Durdreiklang + kleine Septime'
    },
    { 
        name: 'Dmaj7', 
        short: 'Dmaj7',
        intervals: [0, 4, 7, 11],
        description: 'Durdreiklang + große Septime'
    },
    { 
        name: 'M7', 
        short: 'M7',
        intervals: [0, 3, 7, 10],
        description: 'Molldreiklang + kleine Septime'
    },
    { 
        name: 'v7', 
        short: 'v7',
        intervals: [0, 3, 6, 9],
        description: 'Verminderter Dreiklang + verminderte Septime'
    },
    { 
        name: 'D56', 
        short: 'D5/6',
        intervals: [0, 4, 7, 9],
        description: 'Durdreiklang + große Sexte'
    },
    { 
        name: 'M56', 
        short: 'M5/6',
        intervals: [0, 3, 7, 9],
        description: 'Molldreiklang + große Sexte'
    }
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
    
    // Random chord
    const akkord = akkorde[Math.floor(Math.random() * akkorde.length)];
    
    // Random root note in range g (G3) to c3 (C6)
    // But ensure highest note doesn't exceed C6
    const minIndex = allNotes.indexOf('G3');
    const maxIndex = allNotes.indexOf('C6') - Math.max(...akkord.intervals);
    
    if (maxIndex < minIndex) {
        // Chord too large for this range
        generateNewAkkord();
        return;
    }
    
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const rootNote = allNotes[randomIndex];
    
    // Build chord in close position (enge Lage)
    const chordNotes = akkord.intervals.map(interval => {
        const note = getNoteByInterval(rootNote, interval);
        return note;
    }).filter(n => n !== null);
    
    if (chordNotes.length !== 4) {
        // Some notes out of range
        generateNewAkkord();
        return;
    }
    
    currentAkkord = {
        name: akkord.name,
        short: akkord.short,
        description: akkord.description,
        rootNote: rootNote,
        notes: chordNotes
    };
    
    // Clear previous notation
    clearNotation('notation-akkord');
    
    // Reset UI
    document.getElementById('akkord-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('next-akkord').style.display = 'none';
    document.getElementById('akkord-answer-section').style.display = 'none';
    document.getElementById('play-akkord').disabled = false;
    document.getElementById('replay-akkord').disabled = true;
    
    // Reset answer buttons
    document.querySelectorAll('#akkord-answer-section .answer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

async function playAkkord() {
    if (!currentAkkord) return;
    
    const playBtn = document.getElementById('play-akkord');
    const replayBtn = document.getElementById('replay-akkord');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    // Play according to BW guidelines:
    // 1. Each note individually (not held) - ascending
    // 2. All notes together (once)
    
    try {
        // Play each note individually
        for (const note of currentAkkord.notes) {
            await playNoteSequence([note], 0.2);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Short pause
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Play all together
        await playNoteSequence([currentAkkord.notes], 0.1);
        
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
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    akkordStats.total++;
    
    if (answer === currentAkkord.name) {
        akkordStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentAkkord.short} (${currentAkkord.description}).`;
        feedback.className = 'feedback show correct';
        
        // Highlight correct button
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('correct');
            }
        });
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentAkkord.short} (${currentAkkord.description}).`;
        feedback.className = 'feedback show wrong';
        
        // Highlight wrong and correct buttons
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('wrong');
            }
            if (btn.textContent.includes(currentAkkord.name)) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Show notation after answer
    displayChord('notation-akkord', currentAkkord.notes);
    
    updateAkkordStats();
    document.getElementById('next-akkord').style.display = 'block';
}

function nextAkkord() {
    generateNewAkkord();
}

function updateAkkordStats() {
    document.getElementById('akkord-correct').textContent = akkordStats.correct;
    document.getElementById('akkord-wrong').textContent = akkordStats.wrong;
    document.getElementById('akkord-total').textContent = akkordStats.total;
}