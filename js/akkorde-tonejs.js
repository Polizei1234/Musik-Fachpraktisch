// Akkorde mit Tone.js

const akkorde = [
    { name: 'Durdreiklang', short: 'D', intervals: [0, 4, 7] },
    { name: 'Molldreiklang', short: 'M', intervals: [0, 3, 7] },
    { name: 'Übermäßiger Dreiklang', short: 'ü', intervals: [0, 4, 8] },
    { name: 'D7', short: 'D7', intervals: [0, 4, 7, 10] },
    { name: 'Dmaj7', short: 'Dmaj7', intervals: [0, 4, 7, 11] },
    { name: 'M7', short: 'M7', intervals: [0, 3, 7, 10] },
    { name: 'v7', short: 'v7', intervals: [0, 3, 6, 9] },
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
    
    const baseNotes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
    const baseNote = baseNotes[Math.floor(Math.random() * baseNotes.length)];
    
    const chordNotes = akkord.intervals.map(semitones => getNoteByInterval(baseNote, semitones));
    
    const voicing = [
        getNoteByInterval(chordNotes[0], -12),
        ...chordNotes
    ];
    
    currentAkkord = {
        name: akkord.name,
        short: akkord.short,
        notes: voicing
    };
    
    clearNotation('notation-akkord');
    document.getElementById('akkord-feedback').classList.remove('show', 'correct', 'wrong');
    document.getElementById('akkord-feedback').textContent = '';
    document.getElementById('next-akkord').style.display = 'none';
    document.getElementById('akkord-answer-section').style.display = 'none';
    document.getElementById('play-akkord').disabled = false;
    
    document.querySelectorAll('#akkord-answer-section .answer-btn').forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
    });
}

async function playAkkord() {
    if (!currentAkkord) return;
    
    const playBtn = document.getElementById('play-akkord');
    playBtn.disabled = true;
    
    console.log('▶ Playing chord with Tone.js');
    
    try {
        // 1. Nacheinander (arpeggiert)
        const arpeggio = [];
        let time = 0;
        currentAkkord.notes.forEach(note => {
            arpeggio.push({ notes: note, time: time, duration: 0.8 });
            time += 0.6; // Überlappend
        });
        
        await scheduleNotes(arpeggio);
        await new Promise(r => setTimeout(r, time * 1000 + 1000));
        
        // Kurze Pause
        await new Promise(r => setTimeout(r, 500));
        
        // 2. Zusammen (akkordisch)
        await scheduleNotes([
            { notes: currentAkkord.notes, time: 0, duration: 3.0 }
        ]);
        await new Promise(r => setTimeout(r, 3500));
        
    } catch (error) {
        console.error('❌ Error:', error);
    }
    
    if (!hasPlayedAkkord) {
        document.getElementById('akkord-answer-section').style.display = 'block';
        hasPlayedAkkord = true;
    }
    
    playBtn.disabled = false;
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
        feedback.textContent = `✅ Richtig! Das war ein ${currentAkkord.short}.`;
        feedback.className = 'feedback show correct';
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) btn.classList.add('correct');
        });
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ein ${currentAkkord.short}, nicht ${getAkkordShortName(answer)}.`;
        feedback.className = 'feedback show wrong';
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) btn.classList.add('wrong');
            if (btn.textContent.includes(currentAkkord.name)) btn.classList.add('correct');
        });
    }
    
    displayChord('notation-akkord', currentAkkord.notes);
    updateAkkordStats();
    document.getElementById('next-akkord').style.display = 'block';
}

function getAkkordShortName(fullName) {
    const chord = akkorde.find(a => a.name === fullName);
    return chord ? chord.short : fullName;
}

function nextAkkord() {
    generateNewAkkord();
}

function updateAkkordStats() {
    document.getElementById('akkord-correct').textContent = akkordStats.correct;
    document.getElementById('akkord-wrong').textContent = akkordStats.wrong;
    document.getElementById('akkord-total').textContent = akkordStats.total;
}