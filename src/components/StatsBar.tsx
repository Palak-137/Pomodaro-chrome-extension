import React from 'react';
import { Flame, Clock, CheckCircle } from 'lucide-react';
import type { Stats } from '../types';

interface StatsBarProps {
  stats: Stats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="flex items-center justify-center gap-6 py-3 px-6 bg-neutral-900/40 rounded-2xl border border-neutral-800/80 backdrop-blur-sm text-xs text-neutral-400">
      <div className="flex items-center gap-2" title="Pomodoros completed today">
        <CheckCircle size={15} className="text-rose-400" />
        <span>
          <strong className="text-white font-mono text-sm">{stats.pomodorosCompletedToday}</strong>{' '}
          Today
        </span>
      </div>

      <div className="w-px h-4 bg-neutral-800" />

      <div className="flex items-center gap-2" title="Total focus minutes today">
        <Clock size={15} className="text-teal-400" />
        <span>
          <strong className="text-white font-mono text-sm">{stats.totalFocusTimeToday}m</strong>{' '}
          Focus
        </span>
      </div>

      <div className="w-px h-4 bg-neutral-800" />

      <div className="flex items-center gap-2" title="Consecutive daily streak">
        <Flame size={15} className="text-amber-400" />
        <span>
          <strong className="text-white font-mono text-sm">{stats.streakCount}</strong>{' '}
          Streak
        </span>
      </div>
    </div>
  );
};
