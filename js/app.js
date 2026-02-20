// Main App Logic with Tone.js

let audioReady = false;

// Section Navigation
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎵 Gehörbildungstrainer initialisiert');
    
    // Navigation buttons
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.exercise-section');
    
    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const sectionId = btn.dataset.section;
            
            // Update active nav button
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update active section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            const targetSection = document.getElementById(sectionId + '-section');
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Initialize exercise
                switch(sectionId) {
                    case 'intervalle':
                        if (typeof initIntervalle === 'function') initIntervalle();
                        break;
                    case 'akkorde':
                        if (typeof initAkkorde === 'function') initAkkorde();
                        break;
                    case 'rhythmus':
                        if (typeof initRhythmus === 'function') initRhythmus();
                        break;
                }
            }
        });
    });
    
    // Initialize first section (Intervalle)
    if (typeof initIntervalle === 'function') {
        initIntervalle();
    }
    
    console.log('✅ App bereit! Tone.js wird beim ersten Klick aktiviert.');
});