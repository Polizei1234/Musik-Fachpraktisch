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
                    case 'melodie':
                        if (typeof initMelodie === 'function') initMelodie();
                        break;
                }
            }
        });
    });
    
    // === INTERVALLE BUTTONS ===
    const playIntervallBtn = document.getElementById('play-intervall');
    if (playIntervallBtn) {
        playIntervallBtn.addEventListener('click', () => {
            console.log('👆 Play Intervall button clicked!');
            if (typeof playIntervall === 'function') {
                playIntervall();
            } else {
                console.error('playIntervall function not found!');
            }
        });
    }
    
    const replayIntervallBtn = document.getElementById('replay-intervall');
    if (replayIntervallBtn) {
        replayIntervallBtn.addEventListener('click', () => {
            if (typeof playIntervall === 'function') playIntervall();
        });
    }
    
    const nextIntervallBtn = document.getElementById('next-intervall');
    if (nextIntervallBtn) {
        nextIntervallBtn.addEventListener('click', () => {
            if (typeof nextIntervall === 'function') nextIntervall();
        });
    }
    
    // === AKKORDE BUTTONS ===
    const playAkkordBtn = document.getElementById('play-akkord');
    if (playAkkordBtn) {
        playAkkordBtn.addEventListener('click', () => {
            console.log('👆 Play Akkord button clicked!');
            if (typeof playAkkord === 'function') {
                playAkkord();
            } else {
                console.error('playAkkord function not found!');
            }
        });
    }
    
    const replayAkkordBtn = document.getElementById('replay-akkord');
    if (replayAkkordBtn) {
        replayAkkordBtn.addEventListener('click', () => {
            if (typeof playAkkord === 'function') playAkkord();
        });
    }
    
    const nextAkkordBtn = document.getElementById('next-akkord');
    if (nextAkkordBtn) {
        nextAkkordBtn.addEventListener('click', () => {
            if (typeof nextAkkord === 'function') nextAkkord();
        });
    }
    
    // === RHYTHMUS BUTTONS ===
    const playRhythmusBtn = document.getElementById('play-rhythmus');
    if (playRhythmusBtn) {
        playRhythmusBtn.addEventListener('click', () => {
            console.log('👆 Play Rhythmus button clicked!');
            if (typeof playRhythmus === 'function') {
                playRhythmus();
            } else {
                console.error('playRhythmus function not found!');
            }
        });
    }
    
    const continueRhythmusBtn = document.getElementById('continue-rhythmus');
    if (continueRhythmusBtn) {
        continueRhythmusBtn.addEventListener('click', () => {
            if (typeof continueRhythmus === 'function') continueRhythmus();
        });
    }
    
    const showRhythmusSolutionBtn = document.getElementById('show-rhythmus-solution');
    if (showRhythmusSolutionBtn) {
        showRhythmusSolutionBtn.addEventListener('click', () => {
            if (typeof showRhythmusSolution === 'function') showRhythmusSolution();
        });
    }
    
    const nextRhythmusBtn = document.getElementById('next-rhythmus');
    if (nextRhythmusBtn) {
        nextRhythmusBtn.addEventListener('click', () => {
            if (typeof nextRhythmus === 'function') nextRhythmus();
        });
    }
    
    // === MELODIE BUTTONS ===
    const playMelodieBtn = document.getElementById('play-melodie');
    if (playMelodieBtn) {
        playMelodieBtn.addEventListener('click', () => {
            console.log('👆 Play Melodie button clicked!');
            if (typeof playMelodie === 'function') {
                playMelodie();
            } else {
                console.error('playMelodie function not found!');
            }
        });
    }
    
    const continueMelodieBtn = document.getElementById('continue-melodie');
    if (continueMelodieBtn) {
        continueMelodieBtn.addEventListener('click', () => {
            if (typeof continueMelodie === 'function') continueMelodie();
        });
    }
    
    const showMelodieSolutionBtn = document.getElementById('show-melodie-solution');
    if (showMelodieSolutionBtn) {
        showMelodieSolutionBtn.addEventListener('click', () => {
            if (typeof showMelodieSolution === 'function') showMelodieSolution();
        });
    }
    
    const nextMelodieBtn = document.getElementById('next-melodie');
    if (nextMelodieBtn) {
        nextMelodieBtn.addEventListener('click', () => {
            if (typeof nextMelodie === 'function') nextMelodie();
        });
    }
    
    // Initialize first section (Intervalle)
    if (typeof initIntervalle === 'function') {
        initIntervalle();
    }
    
    console.log('✅ App bereit! Tone.js wird beim ersten Klick aktiviert.');
});