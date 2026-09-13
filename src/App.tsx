import { useState, useEffect, useCallback } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { ModeSelector } from './components/ModeSelector';
import { TimerDisplay } from './components/TimerDisplay';
import { TimerControls } from './components/TimerControls';
import { TaskList } from './components/TaskList';
import { SettingsModal } from './components/SettingsModal';
import { StatsBar } from './components/StatsBar';
import { useTimer, DEFAULT_SETTINGS } from './hooks/useTimer';
import { storageService } from './services/storageService';
import type { Task, Stats, PomodoroSettings, Timermode } from './types';

const getTodayString = () => new Date().toISOString().split('T')[0];

const DEFAULT_STATS: Stats = {
  pomodorosCompletedToday: 0,
  totalFocusTimeToday: 0,
  streakCount: 1,
  lastActivityDate: getTodayString(),
};

export default function App() {
  // Settings state
  const [settings, setSettings] = useState<PomodoroSettings>(() =>
    storageService.get<PomodoroSettings>('pomodoro_settings', DEFAULT_SETTINGS)
  );

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>(() =>
    storageService.get<Task[]>('pomodoro_tasks', [])
  );
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

  // Stats state
  const [stats, setStats] = useState<Stats>(() => {
    const saved = storageService.get<Stats>('pomodoro_stats', DEFAULT_STATS);
    const today = getTodayString();
    if (saved.lastActivityDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const isConsecutive = saved.lastActivityDate === yesterday;
      return {
        pomodorosCompletedToday: 0,
        totalFocusTimeToday: 0,
        streakCount: isConsecutive ? saved.streakCount : 0,
        lastActivityDate: today,
      };
    }
    return saved;
  });

  // Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Focus completion handler
  const handleFocusComplete = useCallback(() => {
    // 1. Update task progress
    setTasks((prevTasks) => {
      if (prevTasks.length === 0) return prevTasks;
      const targetId = activeTaskId || prevTasks.find((t) => !t.completed)?.id;
      if (!targetId) return prevTasks;

      return prevTasks.map((task) =>
        task.id === targetId
          ? { ...task, actualPomodoroCount: task.actualPomodoroCount + 1, updatedAt: Date.now() }
          : task
      );
    });

    // 2. Update daily stats
    setStats((prev) => {
      const today = getTodayString();
      const streak = prev.lastActivityDate === today ? prev.streakCount : prev.streakCount + 1;
      return {
        pomodorosCompletedToday: prev.pomodorosCompletedToday + 1,
        totalFocusTimeToday: prev.totalFocusTimeToday + settings.focusTime,
        streakCount: Math.max(1, streak),
        lastActivityDate: today,
      };
    });
  }, [activeTaskId, settings.focusTime]);

  // Timer hook
  const {
    mode,
    status,
    timeLeft,
    progress,
    cycleCount,
    switchMode,
    togglePlayPause,
    resetTimer,
    skipTimer,
  } = useTimer({
    settings,
    onFocusComplete: handleFocusComplete,
  });

  // Persist settings, tasks, and stats
  useEffect(() => {
    storageService.set('pomodoro_settings', settings);
  }, [settings]);

  useEffect(() => {
    storageService.set('pomodoro_tasks', tasks);
  }, [tasks]);

  useEffect(() => {
    storageService.set('pomodoro_stats', stats);
  }, [stats]);

  // Task Actions
  const handleAddTask = (title: string, estPomodoroCount: number) => {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      estPomodoroCount,
      actualPomodoroCount: 0,
      completed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setTasks((prev) => [...prev, newTask]);
    if (!activeTaskId) {
      setActiveTaskId(newTask.id);
    }
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (activeTaskId === id) {
      setActiveTaskId(null);
    }
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    if (tasks.find((t) => t.id === activeTaskId)?.completed) {
      setActiveTaskId(null);
    }
  };

  // Keyboard shortcut: Space to play/pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        isSettingsOpen
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause, isSettingsOpen]);

  // Ambient gradient color scheme based on current mode
  const bgGradients: Record<Timermode, string> = {
    pomodoro: 'from-rose-950/20 via-neutral-950 to-neutral-950',
    shortBreak: 'from-teal-950/20 via-neutral-950 to-neutral-950',
    longBreak: 'from-indigo-950/20 via-neutral-950 to-neutral-950',
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 bg-radial ${bgGradients[mode]} text-neutral-100 transition-all duration-700`}
    >
      {/* Top Navigation Bar */}
      <header className="w-full max-w-lg flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-base shadow-inner">
            🍅
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-white leading-tight">Pomodoro</h1>
            <p className="text-[10px] text-neutral-400 font-medium">Focus & Achieve</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          title="Edit timer duration & settings"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 hover:border-rose-500/40 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <SettingsIcon size={14} className="text-rose-400" />
          <span>Edit Time</span>
        </button>
      </header>

      {/* Main Focus Stage */}
      <main className="flex flex-col items-center w-full max-w-lg my-auto">
        <ModeSelector mode={mode} onSelectMode={switchMode} />

        <TimerDisplay
          timeLeft={timeLeft}
          progress={progress}
          mode={mode}
          status={status}
          cycleCount={cycleCount}
          longBreakInterval={settings.longBreakInterval}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        <TimerControls
          status={status}
          mode={mode}
          onToggle={togglePlayPause}
          onReset={resetTimer}
          onSkip={skipTimer}
        />

        {/* Daily Stats Summary */}
        <div className="w-full max-w-lg mt-5">
          <StatsBar stats={stats} />
        </div>

        <TaskList
          tasks={tasks}
          activeTaskId={activeTaskId}
          onSelectActiveTask={setActiveTaskId}
          onAddTask={handleAddTask}
          onToggleTask={handleToggleTask}
          onDeleteTask={handleDeleteTask}
          onClearCompleted={handleClearCompleted}
        />
      </main>

      {/* Footer */}
      <footer className="w-full max-w-lg text-center mt-12 py-4 border-t border-neutral-900 text-xs text-neutral-500">
        <p>Press <kbd className="px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 font-mono text-[10px]">Space</kbd> to start or pause</p>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          onSave={setSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
