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
        
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();
        
        const stave = new VF.Stave(10, 40, 480);
        stave.addClef(clef);
        stave.setContext(context).draw();
        
        const vexNotes = [];
        
        if (typeof notes === 'string') {
            const vexNote = noteToVexFlow(notes);
            vexNotes.push(
                new VF.StaveNote({clef: clef, keys: [vexNote], duration: 'w'})
            );
        } else if (Array.isArray(notes)) {
            if (notes.length > 0 && Array.isArray(notes[0])) {
                const vexKeys = notes[0].map(n => noteToVexFlow(n));
                vexNotes.push(
                    new VF.StaveNote({clef: clef, keys: vexKeys, duration: 'w'})
                );
            } else {
                notes.forEach(note => {
                    const vexNote = noteToVexFlow(note);
                    vexNotes.push(
                        new VF.StaveNote({clef: clef, keys: [vexNote], duration: 'q'})
                    );
                });
            }
        }
        
        vexNotes.forEach(note => {
            note.getKeys().forEach((key, index) => {
                if (key.includes('#')) {
                    note.addModifier(new VF.Accidental('#'), index);
                } else if (key.includes('b')) {
                    note.addModifier(new VF.Accidental('b'), index);
                }
            });
        });
        
        const voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables(vexNotes);
        
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('Error displaying notation:', error);
        element.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 0;">Notenansicht</p>';
    }
}

function displayInterval(elementId, note1, note2) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();
        
        const stave = new VF.Stave(10, 40, 480);
        stave.addClef('treble');
        stave.setContext(context).draw();
        
        const vexNote1 = noteToVexFlow(note1);
        const vexNote2 = noteToVexFlow(note2);
        
        const vexNotes = [
            new VF.StaveNote({clef: 'treble', keys: [vexNote1], duration: 'w'}),
            new VF.StaveNote({clef: 'treble', keys: [vexNote2], duration: 'w'})
        ];
        
        vexNotes.forEach(note => {
            note.getKeys().forEach((key, index) => {
                if (key.includes('#')) {
                    note.addModifier(new VF.Accidental('#'), index);
                } else if (key.includes('b')) {
                    note.addModifier(new VF.Accidental('b'), index);
                }
            });
        });
        
        const voice = new VF.Voice({num_beats: 8, beat_value: 4});
        voice.addTickables(vexNotes);
        
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('Error displaying interval:', error);
        element.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 0;">Notenansicht</p>';
    }
}

function displayChord(elementId, notes) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(500, 200);
        const context = renderer.getContext();
        
        const stave = new VF.Stave(10, 40, 480);
        stave.addClef('treble');
        stave.setContext(context).draw();
        
        const vexKeys = notes.map(n => noteToVexFlow(n));
        
        const chordNote = new VF.StaveNote({
            clef: 'treble',
            keys: vexKeys,
            duration: 'w'
        });
        
        chordNote.getKeys().forEach((key, index) => {
            if (key.includes('#')) {
                chordNote.addModifier(new VF.Accidental('#'), index);
            } else if (key.includes('b')) {
                chordNote.addModifier(new VF.Accidental('b'), index);
            }
        });
        
        const voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables([chordNote]);
        
        new VF.Formatter().joinVoices([voice]).format([voice], 400);
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('Error displaying chord:', error);
        element.innerHTML = '<p style="text-align: center; color: #999; padding: 60px 0;">Notenansicht</p>';
    }
}