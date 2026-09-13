# Pomodoro Application — Architecture & Implementation

A high-performance, distraction-free Pomodoro web application built with **Vite**, **React 19**, **TypeScript**, and **Tailwind CSS v4**.

---

## 🏗️ Architecture Overview

The application follows a clean layered architecture designed for speed, zero-latency feedback, and reliable background timer execution:

```
src/
├── types/
│   └── index.ts                 # Type definitions (TimerMode, Task, Stats, Settings)
├── services/
│   ├── audioService.ts          # Web Audio API harmonic chime synthesizer
│   ├── notificationService.ts   # System Desktop Notifications API
│   └── storageService.ts        # Type-safe LocalStorage state persistence
├── hooks/
│   └── useTimer.ts              # Drift-free timer engine & mode cycling
├── components/
│   ├── ModeSelector.tsx         # Focus, Short Break, Long Break switcher
│   ├── TimerDisplay.tsx         # Circular SVG progress ring & countdown
│   ├── TimerControls.tsx        # Start/Pause, Skip, Reset action buttons
│   ├── TaskList.tsx             # Interactive task manager & active focus tracker
│   ├── SettingsModal.tsx        # Configurable intervals, auto-start, volume
│   └── StatsBar.tsx             # Daily focus minutes, completed sessions, streak
├── App.tsx                      # App shell, ambient theme glow, spacebar shortcut
├── main.tsx                     # React root mount
└── index.css                    # Tailwind CSS v4 styling & theme base
```

---

## ⚡ Key Technical Features

### 1. Drift-Free Timer Engine (`useTimer.ts`)
- **Problem**: Modern browsers aggressively throttle `setInterval` (to once per minute) in inactive or background tabs to save power.
- **Solution**: The timer records the target completion timestamp (`Date.now() + durationMs`) and recalculates remaining seconds on every tick. It never drifts or falls behind, even when the computer sleeps or the tab is hidden.

### 2. Zero-Asset Audio Synthesizer (`audioService.ts`)
- Leverages the native **Web Audio API** to synthesize harmonic chime chords (C5, E5, G5, C6) with soft attack and natural exponential decay.
- Requires no external `.mp3` or `.wav` files, guaranteeing instant playback with zero network overhead.

### 3. Desktop Notifications (`notificationService.ts`)
- Dispatches native system notifications when focus or break sessions conclude.
- Automatically requests browser permission upon first user timer activation.

### 4. Live Browser Tab Sync
- Dynamically updates `document.title` with live time and mode (e.g. `(24:45) Focus | Pomodoro`), allowing users to check time from any tab.

### 5. Task Management & Automatic Session Tracking
- Add tasks with estimated Pomodoro counts.
- Click any task to mark it as the **Current Focus**.
- Completed focus intervals automatically increment the active task's actual count (`actual/estimated 🍅`).
- Filter and clear completed tasks with one click.

### 6. Daily Analytics & Streaks
- Tracks daily completed Pomodoros, total focus minutes, and daily streaks.
- Persisted locally via `storageService` with automatic daily rollover.

### 7. Customization & Settings
- Fully configurable focus, short break, and long break durations.
- Configurable long-break interval count (default: every 4 cycles).
- Auto-start breaks / auto-start Pomodoros toggles.
- Sound toggle, volume slider, and audio test button.

### 8. Keyboard Accessibility
- Press <kbd>Space</kbd> anywhere (outside text inputs) to toggle Start / Pause.

---

## 🚀 Getting Started

### Development
```bash
npm run dev
```
Starts the Vite dev server at `http://localhost:5173`.

### Production Build
```bash
npm run build
```
Type checks via `tsc -b` and bundles an optimized production build into `dist/`.

### Linting
```bash
npm run lint
```
Runs ESLint with React Hooks and TypeScript verification.

