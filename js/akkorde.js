// Akkord-Übung nach BW-Richtlinien
// 9 Akkorde: D, M, ü, D7, Dmaj7, M7, v7, D5/6, M5/6
// 4-stimmig, Grundstellung, enge Lage
// Tonraum: g bis c3 (G3 bis C6)

const akkorde = [
    { name: 'Durdreiklang', short: 'D', intervals: [0, 4, 7] },
    { name: 'Molldreiklang', short: 'M', intervals: [0, 3, 7] },
    { name: 'Übermäßiger Dreiklang', short: 'ü', intervals: [0, 4, 8] },
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
    
    // Random root note between G3 and C5 to ensure all voices fit within G3-C6
    const minIndex = allNotes.indexOf('G3');
    const maxIndex = allNotes.indexOf('C5');
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const rootNote = allNotes[randomIndex];
    
    // Build chord notes
    const notes = akkord.intervals.map(interval => getNoteByInterval(rootNote, interval));
    
    // Verify all notes are in range
    if (notes.some(note => !note || allNotes.indexOf(note) > allNotes.indexOf('C6'))) {
        generateNewAkkord();
        return;
    }
    
    currentAkkord = {
        name: akkord.name,
        short: akkord.short,
        rootNote: rootNote,
        notes: notes
    };
    
    clearNotation('notation-akkord');
    
    document.getElementById('akkord-feedback').classList.remove('show', 'correct', 'wrong');
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
    
    const playBtn = document.getElementById('play-akkord');
    const replayBtn = document.getElementById('replay-akkord');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    try {
        // Play each note individually first
        for (const note of currentAkkord.notes) {
            await playNoteSequence([note], 0.15);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Play all notes together
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
    
    buttons.forEach(btn => btn.disabled = true);
    
    akkordStats.total++;
    
    const isCorrect = (answer === currentAkkord.name);
    
    if (isCorrect) {
        akkordStats.correct++;
        feedback.textContent = `✅ Richtig! Das war ${currentAkkord.short}.`;
        feedback.className = 'feedback show correct';
        
        // Play Vanessa clap sound if in Vanessa mode
        if (typeof playVanessaCorrect === 'function') {
            playVanessaCorrect();
        }
        
        buttons.forEach(btn => {
            if (btn.textContent.includes(answer)) {
                btn.classList.add('correct');
            }
        });
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentAkkord.short}, nicht ${getAkkordShort(answer)}.`;
        feedback.className = 'feedback show wrong';
        
        // Play Vanessa boo sound if in Vanessa mode
        if (typeof playVanessaWrong === 'function') {
            playVanessaWrong();
        }
        
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