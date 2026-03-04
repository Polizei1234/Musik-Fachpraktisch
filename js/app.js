// Main App Logic

console.log('🎵 Gehörbildungstrainer initialisiert');

let currentSection = 'intervalle';

// Navigation
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.exercise-section');

navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetSection = btn.dataset.section;
        
        // Update active states
        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection + '-section') {
                section.classList.add('active');
            }
        });
        
        currentSection = targetSection;
    });
});

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    
    // Intervalle
    const playIntervallBtn = document.getElementById('play-intervall');
    if (playIntervallBtn) {
        playIntervallBtn.addEventListener('click', async () => {
            console.log('👆 Play Intervall button clicked!');
            await playIntervall();
        });
    }
    
    // Akkorde
    const playAkkordBtn = document.getElementById('play-akkord');
    if (playAkkordBtn) {
        playAkkordBtn.addEventListener('click', async () => {
            console.log('👆 Play Akkord button clicked!');
            await playAkkord();
        });
    }
    
    // Initialize all sections
    if (typeof initIntervalle === 'function') {
        initIntervalle();
        console.log('✅ Intervalle initialized');
    }
    
    if (typeof initAkkorde === 'function') {
        initAkkorde();
        console.log('✅ Akkorde initialized');
    }
    
    if (typeof initRhythmus === 'function') {
        initRhythmus();
        console.log('✅ Rhythmus initialized');
    }
    
    if (typeof initMelodie === 'function') {
        initMelodie();
        console.log('✅ Melodie initialized');
    }
});

// KEYBOARD SHORTCUTS!
document.addEventListener('keydown', (e) => {
    // Space = Play current exercise
    if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        
        if (currentSection === 'intervalle') {
            document.getElementById('play-intervall')?.click();
        } else if (currentSection === 'akkorde') {
            document.getElementById('play-akkord')?.click();
        } else if (currentSection === 'rhythmus') {
            document.getElementById('play-rhythmus')?.click();
        } else if (currentSection === 'melodie') {
            document.getElementById('play-melodie')?.click();
        }
    }
    
    // Enter = Next exercise
    if (e.code === 'Enter' && !e.target.matches('input, textarea')) {
        if (currentSection === 'intervalle') {
            const nextBtn = document.getElementById('next-intervall');
            if (nextBtn && nextBtn.style.display !== 'none') {
                nextBtn.click();
            }
        } else if (currentSection === 'akkorde') {
            const nextBtn = document.getElementById('next-akkord');
            if (nextBtn && nextBtn.style.display !== 'none') {
                nextBtn.click();
            }
        }
    }
    
    // Number keys 1-9 for answers (only if answer section is visible)
    if (e.key >= '1' && e.key <= '9') {
        const answerSection = document.querySelector(`#${currentSection}-answer-section`);
        if (answerSection && answerSection.style.display !== 'none') {
            const buttons = answerSection.querySelectorAll('.answer-btn:not([disabled])');
            const index = parseInt(e.key) - 1;
            if (index < buttons.length) {
                buttons[index].click();
            }
        }
    }
});

console.log('⌨️ Keyboard Shortcuts aktiviert:');
console.log('  - SPACE = Abspielen');
console.log('  - ENTER = Nächste Aufgabe');
console.log('  - 1-9 = Antwort auswählen');
