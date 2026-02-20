// Akkorde mit Tone.js

const akkorde = [
    { name: 'Dur-Dreiklang', intervals: [0, 4, 7], short: 'Dur' },
    { name: 'Moll-Dreiklang', intervals: [0, 3, 7], short: 'Moll' },
    { name: 'Übermäßiger Dreiklang', intervals: [0, 4, 8], short: 'Üb' },
    { name: 'Verminderter Dreiklang', intervals: [0, 3, 6], short: 'Verm' },
    { name: 'Dominantseptakkord', intervals: [0, 4, 7, 10], short: 'Dom7' },
    { name: 'Großer Septakkord', intervals: [0, 4, 7, 11], short: 'Maj7' },
    { name: 'Kleiner Septakkord', intervals: [0, 3, 7, 10], short: 'Min7' },
    { name: 'Halbverminderter Septakkord', intervals: [0, 3, 6, 10], short: 'Halbverm7' }
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
    const minIndex = allNotes.indexOf('C3');
    const maxSemitones = Math.max(...akkord.intervals);
    const maxIndex = allNotes.indexOf('C5') - maxSemitones;
    
    if (maxIndex < minIndex) {
        generateNewAkkord();
        return;
    }
    
    const randomIndex = minIndex + Math.floor(Math.random() * (maxIndex - minIndex + 1));
    const baseNote = allNotes[randomIndex];
    
    const chordNotes = akkord.intervals.map(interval => 
        getNoteByInterval(baseNote, interval)
    ).filter(note => note !== null);
    
    if (chordNotes.length !== akkord.intervals.length) {
        generateNewAkkord();
        return;
    }
    
    currentAkkord = {
        name: akkord.name,
        short: akkord.short,
        notes: chordNotes,
        intervals: akkord.intervals
    };
    
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
    
    const playBtn = document.getElementById('play-akkord');
    const replayBtn = document.getElementById('replay-akkord');
    
    playBtn.disabled = true;
    replayBtn.disabled = true;
    
    console.log('▶ Playing chord with Tone.js');
    
    try {
        const schedule = [];
        let time = 0;
        
        // Play each note individually (2s each)
        currentAkkord.notes.forEach((note, index) => {
            schedule.push({ notes: note, time: time, duration: 2.0 });
            time += 2.5;
        });
        
        // Play full chord (2s)
        schedule.push({ notes: currentAkkord.notes, time: time, duration: 2.0 });
        
        await scheduleNotes(schedule);
        
        // Wait for completion
        const totalTime = (currentAkkord.notes.length * 2.5) + 2.5;
        await new Promise(r => setTimeout(r, totalTime * 1000));
        
    } catch (error) {
        console.error('❌ Error:', error);
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
            if (btn.textContent.includes(answer)) btn.classList.add('correct');
        });
    } else {
        akkordStats.wrong++;
        feedback.textContent = `❌ Falsch! Das war ${currentAkkord.short}, nicht ${getAkkordShortName(answer)}.`;
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