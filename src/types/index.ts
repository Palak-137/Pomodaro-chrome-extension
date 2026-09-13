export type Timermode = 'pomodoro' | 'shortBreak' | 'longBreak';
export type TimerMode = Timermode;
export type TimerState = 'running' | 'paused' | 'stopped';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface PomodoroSettings {
  focusTime: number;          // in minutes (default: 25)
  shortBreakTime: number;     // in minutes (default: 5)
  longBreakTime: number;      // in minutes (default: 15)
  longBreakInterval: number;  // cycles before long break (default: 4)
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  volume: number;             // 0.0 to 1.0
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  estPomodoroCount: number;
  actualPomodoroCount: number;
  updatedAt?: number;
}

export interface Stats {
  pomodorosCompletedToday: number;
  totalFocusTimeToday: number; // in minutes
  streakCount: number;
  lastActivityDate: string;
}

export interface PersistedTimerSession {
  status: TimerStatus;
  mode: Timermode;
  endTime: number | null;
  activeRemainingTime: number | null;
  cycleCount: number;
}
