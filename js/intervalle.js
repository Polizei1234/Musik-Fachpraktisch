// Intervall Exercise Logic

const intervalle = [
    { name: 'Prime', semitones: 0 },
    { name: 'Kleine Sekunde', semitones: 1 },
    { name: 'Große Sekunde', semitones: 2 },
    { name: 'Kleine Terz', semitones: 3 },
    { name: 'Große Terz', semitones: 4 },
    { name: 'Quarte', semitones: 5 },
    { name: 'Tritonus', semitones: 6 },
    { name: 'Quinte', semitones: 7 },
    { name: 'Kleine Sexte', semitones: 8 },
    { name: 'Große Sexte', semitones: 9 },
    { name: 'Kleine Septime', semitones: 10 },
    { name: 'Große Septime', semitones: 11 },
    { name: 'Oktave', semitones: 12 }
];

let currentIntervall = null;
let intervallStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayed = false;
let hasAnswered = false;

function initIntervalle() {
    // Reset stats
    intervallStats = { correct: 0, wrong: 0, total: 0 };
    updateIntervallStats();
    
    // Generate new intervall
    generateNewIntervall();
}

function generateNewIntervall() {
    hasPlayed = false;
    hasAnswered = false;
    
    // Random intervall
    const intervall = intervalle[Math.floor(Math.random() * intervalle.length)];
    
    // Random starting note (C2 to C4 range)
    const startNote = getRandomNote('C2', 'C4');
    const endNote = getNoteByInterval(startNote, intervall.semitones);
    
    // Ensure end note is valid
    if (!endNote) {
        generateNewIntervall();
        return;
    }
    
    currentIntervall = {
        name: intervall.name,
        notes: [startNote, endNote]
    };
    
    // Clear notation
    clearNotation('notation-intervall');
    
    // Reset UI
    document.getElementById('intervall-answer-section').style.display = 'none';
    document.getElementById('intervall-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('next-intervall').style.display = 'none';
    document.getElementById('play-intervall').disabled = false;
    document.getElementById('replay-intervall').disabled = true;
    
    // Reset answer buttons
    document.querySelectorAll('#intervalle-screen .answer-btn').forEach(btn => {
        btn.classList.remove('correct', 'wrong');
        btn.disabled = false;
    });
}

async function playIntervall() {
    if (!currentIntervall) return;
    
    const playBtn = document.getElementById('play-intervall');
    const replayBtn = document.getElementById('replay-intervall');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    // Play notes sequentially, then together
    const [note1, note2] = currentIntervall.notes;
    await playNoteSequence([note1, note2, [note1, note2]]);
    
    // Show answer section after first play
    if (!hasPlayed) {
        document.getElementById('intervall-answer-section').style.display = 'block';
        hasPlayed = true;
    }
    
    playBtn.disabled = hasAnswered;
    replayBtn.disabled = false;
}

function checkIntervall(answer) {
    if (!hasPlayed || hasAnswered) return;
    
    hasAnswered = true;
    intervallStats.total++;
    
    const isCorrect = answer === currentIntervall.name;
    const feedback = document.getElementById('intervall-feedback');
    
    if (isCorrect) {
        intervallStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentIntervall.name}.`;
        feedback.className = 'feedback show correct';
    } else {
        intervallStats.wrong++;
        feedback.textContent = `❌ Leider falsch. Das war ${currentIntervall.name}, nicht ${answer}.`;
        feedback.className = 'feedback show wrong';
    }
    
    // Highlight correct answer
    document.querySelectorAll('#intervalle-screen .answer-btn').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === currentIntervall.name) {
            btn.classList.add('correct');
        } else if (btn.textContent === answer && !isCorrect) {
            btn.classList.add('wrong');
        }
    });
    
    // Show notation
    displayNotes('notation-intervall', currentIntervall.notes);
    
    // Show next button and disable play button
    document.getElementById('next-intervall').style.display = 'block';
    document.getElementById('play-intervall').disabled = true;
    
    // Update stats
    updateIntervallStats();
}

function nextIntervall() {
    generateNewIntervall();
}

function updateIntervallStats() {
    document.getElementById('intervall-correct').textContent = intervallStats.correct;
    document.getElementById('intervall-wrong').textContent = intervallStats.wrong;
    document.getElementById('intervall-total').textContent = intervallStats.total;
}