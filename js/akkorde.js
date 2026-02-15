// Akkord Exercise Logic

const akkorde = [
    { 
        name: 'Dur (Grundstellung)', 
        intervals: [0, 4, 7, 12]  // Root, major third, fifth, octave
    },
    { 
        name: 'Dur mit großer Septime', 
        intervals: [0, 4, 7, 11]  // Root, major third, fifth, major seventh
    },
    { 
        name: 'Dur mit kleiner Septime', 
        intervals: [0, 4, 7, 10]  // Root, major third, fifth, minor seventh
    },
    { 
        name: 'Dur mit Sexte', 
        intervals: [0, 4, 7, 9]  // Root, major third, fifth, sixth
    },
    { 
        name: 'Moll (Grundstellung)', 
        intervals: [0, 3, 7, 12]  // Root, minor third, fifth, octave
    },
    { 
        name: 'Moll mit kleiner Septime', 
        intervals: [0, 3, 7, 10]  // Root, minor third, fifth, minor seventh
    },
    { 
        name: 'Moll mit Sexte', 
        intervals: [0, 3, 7, 9]  // Root, minor third, fifth, sixth
    },
    { 
        name: 'Vermindert', 
        intervals: [0, 3, 6, 12]  // Root, minor third, diminished fifth, octave
    },
    { 
        name: 'Übermäßig', 
        intervals: [0, 4, 8, 12]  // Root, major third, augmented fifth, octave
    }
];

let currentAkkord = null;
let akkordStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayedAkkord = false;
let hasAnsweredAkkord = false;

function initAkkorde() {
    // Reset stats
    akkordStats = { correct: 0, wrong: 0, total: 0 };
    updateAkkordStats();
    
    // Generate new akkord
    generateNewAkkord();
}

function generateNewAkkord() {
    hasPlayedAkkord = false;
    hasAnsweredAkkord = false;
    
    // Random akkord
    const akkord = akkorde[Math.floor(Math.random() * akkorde.length)];
    
    // Random starting note (C2 to B3 range to ensure all notes fit)
    const startNote = getRandomNote('C2', 'B3');
    const notes = akkord.intervals.map(interval => getNoteByInterval(startNote, interval));
    
    // Ensure all notes are valid
    if (notes.some(note => !note)) {
        generateNewAkkord();
        return;
    }
    
    currentAkkord = {
        name: akkord.name,
        notes: notes
    };
    
    // Clear notation
    clearNotation('notation-akkord');
    
    // Reset UI
    document.getElementById('akkord-answer-section').style.display = 'none';
    document.getElementById('akkord-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('next-akkord').style.display = 'none';
    document.getElementById('play-akkord').disabled = false;
    document.getElementById('replay-akkord').disabled = true;
    
    // Reset answer buttons
    document.querySelectorAll('#akkorde-screen .answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
}

async function playAkkord() {
    if (!currentAkkord || hasAnsweredAkkord) return;
    
    const playBtn = document.getElementById('play-akkord');
    const replayBtn = document.getElementById('replay-akkord');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    // Play notes sequentially upward, then together
    const notes = currentAkkord.notes;
    const sequence = [...notes, notes];  // Individual notes, then chord
    await playNoteSequence(sequence);
    
    // Show answer section after playing
    document.getElementById('akkord-answer-section').style.display = 'block';
    
    playBtn.disabled = true;
    replayBtn.disabled = false;
    hasPlayedAkkord = true;
}

function checkAkkord(answer) {
    if (!hasPlayedAkkord || hasAnsweredAkkord) return;
    
    hasAnsweredAkkord = true;
    akkordStats.total++;
    
    const isCorrect = answer === currentAkkord.name;
    const feedback = document.getElementById('akkord-feedback');
    
    if (isCorrect) {
        akkordStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentAkkord.name}.`;
        feedback.className = 'feedback show correct';
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Leider falsch. Das war ${currentAkkord.name}, nicht ${answer}.`;
        feedback.className = 'feedback show wrong';
    }
    
    // Highlight correct answer
    document.querySelectorAll('#akkorde-screen .answer-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentAkkord.name) {
            btn.classList.add('correct');
        } else if (btn.textContent === answer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Show notation (chord)
    displayNotes('notation-akkord', [currentAkkord.notes]);
    
    // Show next button
    document.getElementById('next-akkord').style.display = 'block';
    
    // Update stats
    updateAkkordStats();
}

function nextAkkord() {
    generateNewAkkord();
}

function updateAkkordStats() {
    document.getElementById('akkord-correct').textContent = akkordStats.correct;
    document.getElementById('akkord-wrong').textContent = akkordStats.wrong;
    document.getElementById('akkord-total').textContent = akkordStats.total;
}