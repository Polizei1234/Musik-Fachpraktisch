# 🎵 Gehörbildungstrainer

> Interaktiver Webtrainer für das fachpraktische Abitur Baden-Württemberg - Musik Leistungskurs

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://polizei1234.github.io/Musik-Fachpraktisch/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

## ✨ Features

### 🎼 Intervalle
- **12 verschiedene Intervalle** (kleine Sekunde bis reine Oktave)
- **Tonraum:** g bis g² (G3-G5)
- **Diktiermodus:** Erst einzeln, dann zusammen
- Sofortige Auswertung mit visueller Notennotation
- Live-Statistik (Richtig/Falsch/Gesamt)

### 🎹 Akkorde
- **9 verschiedene Akkordtypen:**
  - Durdreiklang (D), Molldreiklang (M), Übermäßiger Dreiklang (ü)
  - D7, Dmaj7, M7, v7
  - D5/6, M5/6
- **4-stimmig** in enger Lage, Grundstellung
- **Tonraum:** g bis c³ (G3-C6)
- **Diktiermodus:** Erst aufsteigend einzeln, dann zusammen

### 🥁 Rhythmusdiktat
- **4 Takte** im 4/4-Takt
- **Tempo:** ♩ = ca. 60 BPM
- **Elemente:** Synkopen, Triolen, Punktierungen
- **Diktiermodus:** 1-4 → einzeln → 1-4 (wie in der Prüfung)
- Lösung zur Selbstkontrolle

## 🎧 Audioquality

- **Echte Klaviersamples** (Acoustic Grand Piano)
- **Hochwertige MP3-Aufnahmen** aus [MIDI.js Soundfonts](https://github.com/gleitz/midi-js-soundfonts)
- Automatisches Preloading für flüssige Wiedergabe
- Fallback-Synthesizer bei Ladefehlern

## 💻 Technologie

- **Pure Web-App** – HTML5, CSS3, JavaScript (ES6+)
- **Web Audio API** für Audio-Wiedergabe
- **VexFlow** für professionelle Notendarstellung
- **Glassmorphism UI** für modernen Look
- **Responsive Design** – funktioniert auf allen Geräten

## 🚀 Nutzung

### Online (empfohlen)
**Direkt im Browser:** [https://polizei1234.github.io/Musik-Fachpraktisch/](https://polizei1234.github.io/Musik-Fachpraktisch/)

### Lokal
```bash
git clone https://github.com/Polizei1234/Musik-Fachpraktisch.git
cd Musik-Fachpraktisch
# Öffne index.html im Browser
```

**Hinweis:** Bei lokaler Nutzung einen lokalen Server verwenden (z.B. `python -m http.server` oder Live Server Extension), damit die Samples korrekt laden.

## 📚 Entwickelt für

**Fachpraktisches Abitur Baden-Württemberg** • Musik Leistungskurs

Basierend auf den offiziellen Durchführungsbestimmungen des Ministeriums für Kultus, Jugend und Sport Baden-Württemberg.

## 🛠️ Projektstruktur

```
Musik-Fachpraktisch/
├── index.html              # Hauptseite
├── css/
│   └── style.css           # Modernes Design
├── js/
│   ├── app.js              # App-Logik
│   ├── audio.js            # Audio-Engine mit Samples
│   ├── notation.js         # VexFlow Notennotation
│   ├── intervalle.js       # Intervall-Übungen
│   ├── akkorde.js          # Akkord-Übungen
│   └── rhythmus.js         # Rhythmusdiktat
└── audio/
    └── acoustic_grand_piano-mp3/  # Klaviersamples
```

## 👥 Für Mitschüler

Dieses Tool ist **kostenlos** und kann von allen Schülern im Musik-LK genutzt werden. Einfach den Link teilen!

📌 **Link:** [https://polizei1234.github.io/Musik-Fachpraktisch/](https://polizei1234.github.io/Musik-Fachpraktisch/)

## 🔧 Entwicklungsstand

- ✅ Intervalle (vollständig)
- ✅ Akkorde (vollständig)
- ✅ Rhythmusdiktat (vollständig)
- ✅ Echte Klaviersamples
- ✅ Modernes UI-Design
- 🚧 Melodiediktat (in Planung)
- 🚧 Prüfungsmodus (in Planung)

## 📝 Lizenz

MIT License – Frei nutzbar für Bildungszwecke

## 🎹 Credits

- **Piano-Samples:** [MIDI.js Soundfonts](https://github.com/gleitz/midi-js-soundfonts) (Acoustic Grand Piano)
- **Notennotation:** [VexFlow](https://www.vexflow.com/)
- **Entwickelt von:** Polizei1234

---

**⭐ Viel Erfolg beim Üben und im Abitur! ⭐**