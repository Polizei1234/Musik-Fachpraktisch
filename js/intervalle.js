// Intervall-Übung nach BW-Richtlinien
// Tonraum: g bis g2 (G3 bis G5)
// k2, g2, k3, g3, r4, Tritonus, r5, k6, g6, k7, g7, r8
// Diktiermodus: Erst einzeln (Viertel bei BPM=60 = 1 Sekunde), dann zusammen

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
    
    // Random base note in range g (G3) to g2 (G5)
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
    
    if (typeof unlockAudio === 'function') {
        await unlockAudio();
    }
    
    const playBtn = document.getElementById('play-intervall');
    const replayBtn = document.getElementById('replay-intervall');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    console.log('Playing interval (BPM=60, quarter notes):', currentIntervall.baseNote, currentIntervall.secondNote);
    
    try {
        // BPM = 60 -> 1 Viertelnote = 1 Sekunde
        const quarterNote = 1.0; // 1 second duration
        const pause = 1000; // 1 second pause in milliseconds
        
        // Play first note (1 second)
        await playNote(currentIntervall.baseNote, quarterNote);
        console.log('First note played (1s)');
        
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, pause));
        
        // Play second note (1 second)
        await playNote(currentIntervall.secondNote, quarterNote);
        console.log('Second note played (1s)');
        
        // Wait 1 second
        await new Promise(resolve => setTimeout(resolve, pause));
        
        // Play both together (longer for chord)
        const ctx = getAudioContext();
        if (ctx) {
            await playPianoSample(currentIntervall.baseNote, ctx.currentTime, 1.5);
            await playPianoSample(currentIntervall.secondNote, ctx.currentTime, 1.5);
        }
        console.log('Both notes played together (1.5s)');
        
        // Wait for chord to finish
        await new Promise(resolve => setTimeout(resolve, 1500));
        
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
    
    console.log('Checking answer:', answer, 'Correct:', currentIntervall.name);
    
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
            if (btn.textContent.includes(answer)) {
                btn.classList.add('correct');
            }
        });
    } else {
        intervallStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentIntervall.short}, nicht ${getShortName(answer)}.`;
        feedback.className = 'feedback show wrong';
        
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('wrong');
            }
            if (btn.textContent.includes(currentIntervall.name)) {
                btn.classList.add('correct');
            }
        });
    }
    
    displayInterval('notation-intervall', currentIntervall.baseNote, currentIntervall.secondNote);
    
    updateIntervallStats();
    
    const nextBtn = document.getElementById('next-intervall');
    if (nextBtn) {
        nextBtn.style.display = 'block';
    }
}

function getShortName(fullName) {
    const interval = intervalle.find(i => i.name === fullName);
    return interval ? interval.short : fullName;
}

function nextIntervall() {
    console.log('Next interval clicked');
    generateNewIntervall();
}

function updateIntervallStats() {
    document.getElementById('intervall-correct').textContent = intervallStats.correct;
    document.getElementById('intervall-wrong').textContent = intervallStats.wrong;
    document.getElementById('intervall-total').textContent = intervallStats.total;
}