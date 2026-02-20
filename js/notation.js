// VexFlow Notation Display Functions

function clearNotation(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '';
    }
}

function displayInterval(elementId, baseNote, secondNote) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(400, 200);
        const context = renderer.getContext();
        
        const stave = new VF.Stave(10, 40, 350);
        stave.addClef('treble').setContext(context).draw();
        
        const notes = [
            new VF.StaveNote({
                clef: 'treble',
                keys: [noteToVexFlow(baseNote)],
                duration: 'w'
            }),
            new VF.StaveNote({
                clef: 'treble',
                keys: [noteToVexFlow(secondNote)],
                duration: 'w'
            })
        ];
        
        const voice = new VF.Voice({num_beats: 8, beat_value: 4});
        voice.addTickables(notes);
        
        new VF.Formatter()
            .joinVoices([voice])
            .format([voice], 300);
        
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('❌ Notation error:', error);
        element.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">' +
            'Fehler bei der Notendarstellung</p>';
    }
}

function displayChord(elementId, notes) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.innerHTML = '';
    
    try {
        const VF = Vex.Flow;
        const renderer = new VF.Renderer(element, VF.Renderer.Backends.SVG);
        renderer.resize(400, 200);
        const context = renderer.getContext();
        
        const stave = new VF.Stave(10, 40, 350);
        stave.addClef('treble').setContext(context).draw();
        
        const vexKeys = notes.map(note => noteToVexFlow(note));
        
        const chordNote = new VF.StaveNote({
            clef: 'treble',
            keys: vexKeys,
            duration: 'w'
        });
        
        const voice = new VF.Voice({num_beats: 4, beat_value: 4});
        voice.addTickables([chordNote]);
        
        new VF.Formatter()
            .joinVoices([voice])
            .format([voice], 300);
        
        voice.draw(context, stave);
        
    } catch (error) {
        console.error('❌ Notation error:', error);
        element.innerHTML = '<p style="text-align: center; padding: 40px; color: #e74c3c;">' +
            'Fehler bei der Notendarstellung</p>';
    }
}