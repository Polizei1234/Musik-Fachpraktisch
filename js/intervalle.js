// Intervall-Übung nach BW-Richtlinien
// Tonraum: g bis g2 (G3 bis G5)
// k2, g2, k3, g3, r4, Tritonus, r5, k6, g6, k7, g7, r8
// Diktiermodus: Erst einzeln (nicht liegen lassen), dann zusammen (jeweils einmal)

const intervalle = [
    { name: 'Kleine Sekunde', semitones: 1, short: 'k2' },
    { name: 'Große Sekunde', semitones: 2, short: 'g2' },
    { name: 'Kleine Terz', semitones: 3, short: 'k3' },
    { name: 'Große Terz', semitones: 4, short: 'g3' },
    { name: 'Reine Quarte', semitones: 5, short: 'r4' },
    { name: 'Tritonus', semitones: 6, short: 'Tritonus' },
    { name: 'Reine Quinte', semitones: 7, short: 'r5' },
    { name: 'Kleine Sexte', semitones: 8, short: 'k6' },
    { name: 'Große Sexte', semitones: 9, short: 'g6' },
    { name: 'Kleine Septime', semitones: 10, short: 'k7' },
    { name: 'Große Septime', semitones: 11, short: 'g7' },
    { name: 'Reine Oktave', semitones: 12, short: 'r8' }
];

let currentIntervall = null;
let intervallStats = { correct: 0, wrong: 0, total: 0 };
let hasPlayedIntervall = false;

function initIntervalle() {
    intervallStats = { correct: 0, wrong: 0, total: 0 };
    updateIntervallStats();
    generateNewIntervall();
}

function generateNewIntervall() {
    hasPlayedIntervall = false;
    
    // Random interval
    const intervall = intervalle[Math.floor(Math.random() * intervalle.length)];
    
    // Random base note in range g (G3) to g2 (G5)
    // But ensure second note doesn't exceed g2
    const minIndex = allNotes.indexOf('G3');
    const maxIndex = allNotes.indexOf('G5') - intervall.semitones;
    
    if (maxIndex < minIndex) {
        // Interval too large for this range, use smaller interval
        generateNewIntervall();
        return;
    }
    
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const baseNote = allNotes[randomIndex];
    const secondNote = getNoteByInterval(baseNote, intervall.semitones);
    
    if (!secondNote) {
        // Skip if note out of range
        generateNewIntervall();
        return;
    }
    
    currentIntervall = {
        name: intervall.name,
        short: intervall.short,
        baseNote: baseNote,
        secondNote: secondNote,
        semitones: intervall.semitones
    };
    
    // Clear previous notation
    clearNotation('notation-intervall');
    
    // Reset UI
    document.getElementById('intervall-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('next-intervall').style.display = 'none';
    document.getElementById('intervall-answer-section').style.display = 'none';
    document.getElementById('play-intervall').disabled = false;
    document.getElementById('replay-intervall').disabled = true;
    
    // Reset answer buttons
    document.querySelectorAll('#intervall-answer-section .answer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

async function playIntervall() {
    if (!currentIntervall) return;
    
    const playBtn = document.getElementById('play-intervall');
    const replayBtn = document.getElementById('replay-intervall');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    // Play according to BW guidelines:
    // 1. First note (not held)
    // 2. Second note (not held)
    // 3. Both notes together (once)
    
    try {
        // Play first note
        await playNoteSequence([currentIntervall.baseNote], 0.3);
        
        // Short pause
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Play second note
        await playNoteSequence([currentIntervall.secondNote], 0.3);
        
        // Short pause
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Play both together
        await playNoteSequence([[currentIntervall.baseNote, currentIntervall.secondNote]], 0.1);
        
    } catch (error) {
        console.error('Error playing interval:', error);
    }
    
    if (!hasPlayedIntervall) {
        document.getElementById('intervall-answer-section').style.display = 'block';
        hasPlayedIntervall = true;
    }
    
    playBtn.disabled = false;
    replayBtn.disabled = false;
}

function checkIntervall(answer) {
    if (!hasPlayedIntervall) return;
    
    const feedback = document.getElementById('intervall-feedback');
    const buttons = document.querySelectorAll('#intervall-answer-section .answer-btn');
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    intervallStats.total++;
    
    const isCorrect = (answer === currentIntervall.name);
    
    if (isCorrect) {
        intervallStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentIntervall.short}.`;
        feedback.className = 'feedback show correct';
        
        // Play Vanessa clap sound if in Vanessa mode
        if (typeof playVanessaCorrect === 'function') {
            playVanessaCorrect();
        }
        
        // Highlight correct button
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('correct');
            }
        });
    } else {
        intervallStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentIntervall.short}, nicht ${getShortName(answer)}.`;
        feedback.className = 'feedback show wrong';
        
        // Play Vanessa boo sound if in Vanessa mode
        if (typeof playVanessaWrong === 'function') {
            playVanessaWrong();
        }
        
        // Highlight wrong and correct buttons
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('wrong');
            }
            if (btn.textContent.includes(currentIntervall.name)) {
                btn.classList.add('correct');
            }
        });
    }
    
    // Show notation after answer
    displayInterval('notation-intervall', currentIntervall.baseNote, currentIntervall.secondNote);
    
    updateIntervallStats();
    document.getElementById('next-intervall').style.display = 'block';
}

function getShortName(fullName) {
    const interval = intervalle.find(i => i.name === fullName);
    return interval ? interval.short : fullName;
}

function nextIntervall() {
    generateNewIntervall();
}

function updateIntervallStats() {
    document.getElementById('intervall-correct').textContent = intervallStats.correct;
    document.getElementById('intervall-wrong').textContent = intervallStats.wrong;
    document.getElementById('intervall-total').textContent = intervallStats.total;
}