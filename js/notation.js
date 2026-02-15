// Notation Display using VexFlow

function clearNotation(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

function displayNotes(elementId, notes, clef = 'treble') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        
        // Create renderer
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();
        
        // Create stave
        const stave = new VF.Stave(10, 40, 480);
        stave.addClef(clef);
        stave.setContext(context).draw();
        
        // Prepare notes for VexFlow
        const vexNotes = [];
        
        if (typeof notes === 'string') {
            // Single note
            const vexNote = noteToVexFlow(notes);
            vexNotes.push(
                new VF.StaveNote({clef: clef, keys: [vexNote], duration: 'w'})
            );
        } else if (Array.isArray(notes)) {
            if (notes.length > 0 && Array.isArray(notes[0])) {
                // Chord (array of notes)
                const vexKeys = notes[0].map(n => noteToVexFlow(n));
                vexNotes.push(
                    new VF.StaveNote({clef: clef, keys: vexKeys, duration: 'w'})
                );
            } else {
                // Sequence of notes
                notes.forEach(note => {
                    const vexNote = noteToVexFlow(note);
                    vexNotes.push(
                        new VF.StaveNote({clef: clef, keys: [vexNote], duration: 'q'})
                    );
                });
            }
        }
        
        // Add accidentals
        vexNotes.forEach(note => {
            note.getKeys().forEach((key, index) => {
                if (key.includes('#')) {
                    note.addModifier(new VF.Accidental('#'), index);
                } else if (key.includes('b')) {
                    note.addModifier(new VF.Accidental('b'), index);
                }
            });
        });
        
        // Create voice and format
        const voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(vexNotes);
        
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('Error displaying notation:', error);
        element.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 0;">Notenansicht</p>';
    }
}