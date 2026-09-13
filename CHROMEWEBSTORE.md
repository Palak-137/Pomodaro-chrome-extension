# Chrome Web Store Listing — Pomodoro Focus Timer

> Last Updated: 2026-09-13

## Store Listing

**Extension Name** [REQUIRED]
Pomodoro Focus Timer

**Short Description** [REQUIRED]
A distraction-free Pomodoro timer with task tracking, background alarms, audio chimes, and streak analytics.

**Detailed Description** [REQUIRED]
Boost your focus, beat procrastination, and manage your time effortlessly with Pomodoro Focus Timer.

Key Features:
- Classic Pomodoro Technique intervals (25-min focus, 5-min short break, 15-min long break).
- Background Service Worker with persistent alarms: the timer keeps ticking even when the popup is closed.
- Real-time toolbar badge displaying minutes remaining at a glance.
- Native desktop notifications and calming synthesized audio chimes when sessions end.
- Integrated task manager: allocate estimated Pomodoros per task and track progress in real-time.
- Daily analytics: tracks focus minutes, completed Pomodoros, and daily consistency streaks.
- Spacebar shortcut: press Space to quickly start or pause without reaching for the mouse.
- Privacy-first: 100% offline, zero tracking, no accounts, and no data leaves your browser.

How to Use:
1. Click the Pomodoro icon in your Chrome toolbar to open the timer.
2. Select your desired mode (Pomodoro, Short Break, or Long Break) or add a focus task.
3. Hit START or press the Spacebar to begin your session.
4. Keep working—the badge on the extension icon shows your remaining minutes!

**Category** [REQUIRED]
Productivity

**Single Purpose** [REQUIRED]
Tracks timed work intervals and focus tasks using the Pomodoro Technique.

**Primary Language** [REQUIRED]
English

---

## Graphics & Assets

| Asset | Dimensions | Status | Filename |
|---|---|---|---|
| Store Icon [REQUIRED] | 128×128 PNG | ✅ Ready | `public/icons/icon-128.png` |
| Small Icon | 16×16 PNG | ✅ Ready | `public/icons/icon-16.png` |
| Medium Icon | 48×48 PNG | ✅ Ready | `public/icons/icon-48.png` |
| Screenshot 1 [REQUIRED] | 1280×800 or 640×400 | ⬜ Pending capture | |
| Small Promo Tile | 440×280 | ⬜ Optional | |

---

## Permissions Justification

| Permission | Type | Justification |
|---|---|---|
| `storage` | permissions | Saves user preferences, focus tasks, and daily streak statistics locally on the user's device. |
| `alarms` | permissions | Schedules background timer intervals so notifications trigger accurately even when the popup is closed. |
| `notifications` | permissions | Displays desktop notifications when focus sessions or break intervals conclude. |

---

## Privacy & Data Use

### Data Collection
**Does the extension collect user data?** No
All settings, focus tasks, and streak statistics are stored strictly on the user's local machine via Chrome local storage. No data is collected, monitored, or transmitted off-device.

### Data Use Certification
- [x] Data is NOT sold to third parties
- [x] Data is NOT used for purposes unrelated to the extension's core functionality
- [x] Data is NOT used for creditworthiness or lending purposes

---

## Version History

| Version | Date | Changes | Status |
|---|---|---|---|
| 1.0.0 | 2026-09-13 | Initial Manifest V3 release with popup, background alarms, and task manager | Draft |

