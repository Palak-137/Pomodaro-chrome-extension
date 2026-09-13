// Background Service Worker for Chrome Extension (Manifest V3)

interface TimerSessionState {
  status: 'idle' | 'running' | 'paused';
  mode: 'pomodoro' | 'shortBreak' | 'longBreak';
  endTime: number | null;
  timeLeft: number;
  cycleCount?: number;
}

const ALARM_SESSION = 'pomodoro-timer-alarm';
const ALARM_TICKER = 'pomodoro-minute-ticker';

// Top-level listener: Extension install / update
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: '' });
});

// Top-level listener: Alarms fired
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === ALARM_SESSION) {
    const data = await chrome.storage.local.get(['timer_session']);
    const session = data.timer_session as TimerSessionState | undefined;
    const mode = session?.mode || 'pomodoro';

    const isPomodoro = mode === 'pomodoro';
    const title = isPomodoro ? '🍅 Pomodoro Finished!' : '☕ Break Complete!';
    const message = isPomodoro
      ? 'Great work staying focused! Time to recharge.'
      : 'Break is over. Ready to begin your next focus round?';

    chrome.notifications.create(`pomodoro-complete-${Date.now()}`, {
      type: 'basic',
      iconUrl: 'icons/icon-128.png',
      title,
      message,
      priority: 2,
    });

    chrome.action.setBadgeText({ text: 'DONE' });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' });

    chrome.alarms.clear(ALARM_TICKER);

    // Mark session as complete in storage
    await chrome.storage.local.set({
      timer_session: {
        status: 'idle',
        mode: isPomodoro ? 'shortBreak' : 'pomodoro',
        endTime: null,
        timeLeft: 0,
        cycleCount: (session?.cycleCount ?? 0) + (isPomodoro ? 1 : 0),
      },
    });
  } else if (alarm.name === ALARM_TICKER) {
    // Update badge minutes while running in background
    const data = await chrome.storage.local.get(['timer_session']);
    const session = data.timer_session as TimerSessionState | undefined;

    if (session?.status === 'running' && session.endTime) {
      const remainingSeconds = Math.max(0, Math.round((session.endTime - Date.now()) / 1000));
      const mins = Math.ceil(remainingSeconds / 60);
      if (mins > 0) {
        chrome.action.setBadgeText({ text: `${mins}m` });
      }
    }
  }
});

// Top-level listener: Synchronize badge and alarms with storage changes
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'local' || !changes.timer_session) return;

  const session = changes.timer_session.newValue as TimerSessionState | undefined;
  if (!session) return;

  if (session.status === 'running' && session.endTime) {
    const now = Date.now();
    const remainingSeconds = Math.max(0, Math.round((session.endTime - now) / 1000));
    const mins = Math.ceil(remainingSeconds / 60);

    // Schedule background alarms
    chrome.alarms.create(ALARM_SESSION, { when: session.endTime });
    chrome.alarms.create(ALARM_TICKER, { periodInMinutes: 1 });

    // Set badge text to minutes remaining
    chrome.action.setBadgeText({ text: mins > 0 ? `${mins}m` : '0m' });

    const badgeColor =
      session.mode === 'pomodoro'
        ? '#f43f5e'
        : session.mode === 'shortBreak'
        ? '#14b8a6'
        : '#6366f1';
    chrome.action.setBadgeBackgroundColor({ color: badgeColor });
  } else if (session.status === 'paused') {
    chrome.alarms.clear(ALARM_SESSION);
    chrome.alarms.clear(ALARM_TICKER);
    chrome.action.setBadgeText({ text: '⏸' });
    chrome.action.setBadgeBackgroundColor({ color: '#737373' });
  } else {
    // Idle
    chrome.alarms.clear(ALARM_SESSION);
    chrome.alarms.clear(ALARM_TICKER);
    chrome.action.setBadgeText({ text: '' });
  }
});
