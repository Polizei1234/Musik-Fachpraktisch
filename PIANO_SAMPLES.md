# Echte Klaviersamples einbinden

Um echte Klaviersamples zu verwenden, brauchst du MP3-Dateien für jeden Ton.

## Option 1: Fertige Klaviersamples herunterladen

### Empfohlene Quelle: Salamander Grand Piano
1. Gehe zu: https://freepats.zenvoid.org/Piano/acoustic-grand-piano.html
2. Oder direkt: https://github.com/gleitz/midi-js-soundfonts
3. Lade die Samples für C2 bis C6 herunter

### Alternative: Philharmonia Orchestra
1. Gehe zu: https://philharmonia.co.uk/resources/sound-samples/
2. Wähle "Piano" und lade die nötigen Töne herunter

## Option 2: Samples selbst aufnehmen
1. Nimm jeden Ton (C2-C6) einzeln mit deinem Klavier auf
2. Exportiere als MP3 (128kbps oder höher)
3. Benenne die Dateien: `C2.mp3`, `C#2.mp3`, `D2.mp3`, etc.

## Dateistruktur

Erstelle einen neuen Ordner `audio/piano/` und lege dort die Samples:

```
audio/
  piano/
    C2.mp3
    C#2.mp3 (oder Db2.mp3)
    D2.mp3
    D#2.mp3
    ...
    C6.mp3
  river-flows.mp3
  clap.mp3
  boo.mp3
```

## Code-Integration

Wenn du die Samples hast, sage mir Bescheid - dann passe ich `audio.js` an, um die echten Samples statt Synthesizer zu verwenden!

## Vorteile echter Samples
- ✅ Realistischer Klavierklang
- ✅ Keine künstlichen Obertöne
- ✅ Wie beim echten Abi
- ❌ Größere Dateigröße (ca. 2-5 MB pro Ton)
- ❌ Mehr Ladezeit

## Schnellste Lösung

Falls du keine Zeit hast Samples zu suchen/aufzunehmen:
1. Benutze vorerst den aktuellen Synthesizer-Sound
2. Er ist nicht perfekt, aber funktional für Übungszwecke
3. Für die echte Prüfung wird ohnehin ein echtes Klavier verwendet
