// Intervalle mit Tone.js (Professional Sound!)

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
    
    const intervall = intervalle[Math.floor(Math.random() * intervalle.length)];
    const minIndex = allNotes.indexOf('G3');
    const maxIndex = allNotes.indexOf('G5') - intervall.semitones;
    
    if (maxIndex < minIndex) {
        generateNewIntervall();
        return;
    }
    
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const baseNote = allNotes[randomIndex];
    const secondNote = getNoteByInterval(baseNote, intervall.semitones);
    
    if (!secondNote) {
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
    
    clearNotation('notation-intervall');
    document.getElementById('intervall-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('intervall-feedback').textContent = '';
    document.getElementById('next-intervall').style.display = 'none';
    document.getElementById('intervall-answer-section').style.display = 'none';
    document.getElementById('play-intervall').disabled = false;
    document.getElementById('replay-intervall').disabled = true;
    
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
    
    console.log('▶ Playing interval with Tone.js');
    
    try {
        // Kürzere Dauer: 2s statt 3s!
        await scheduleNotes([
            { notes: currentIntervall.baseNote, time: 0, duration: 2.0 },
            { notes: currentIntervall.secondNote, time: 2.5, duration: 2.0 },
            { notes: [currentIntervall.baseNote, currentIntervall.secondNote], time: 5.0, duration: 2.0 }
        ]);
        
        // Wait for completion (2s + 0.5s + 2s + 0.5s + 2s = 7s)
        await new Promise(r => setTimeout(r, 7500));
        
    } catch (error) {
        console.error('❌ Error:', error);
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
    
    buttons.forEach(btn => btn.disabled = true);
    intervallStats.total++;
    
    const isCorrect = (answer === currentIntervall.name);
    
    if (isCorrect) {
        intervallStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentIntervall.short}.`;
        feedback.className = 'feedback show correct';
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) btn.classList.add('correct');
        });
    } else {
        intervallStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentIntervall.short}, nicht ${getShortName(answer)}.`;
        feedback.className = 'feedback show wrong';
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) btn.classList.add('wrong');
            if (btn.textContent.includes(currentIntervall.name)) btn.classList.add('correct');
        });
    }
    
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