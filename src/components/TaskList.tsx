import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, CheckCheck } from 'lucide-react';
import type { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  activeTaskId: string | null;
  onSelectActiveTask: (id: string | null) => void;
  onAddTask: (title: string, estPomodoros: number) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClearCompleted: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeTaskId,
  onSelectActiveTask,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
}) => {
  const [title, setTitle] = useState('');
  const [est, setEst] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title.trim(), est);
    setTitle('');
    setEst(1);
    setIsAdding(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-lg mt-8 bg-neutral-900/60 p-6 rounded-3xl border border-neutral-800 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-semibold text-white tracking-wide">Tasks</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            {tasks.length === 0
              ? 'No tasks queued'
              : `${completedCount} of ${tasks.length} tasks completed`}
          </p>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-rose-400 px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <CheckCheck size={14} />
            <span>Clear done</span>
          </button>
        )}
      </div>

      {/* Task List Items */}
      <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-neutral-500">
            <p className="text-sm">Stay organized and focused.</p>
            <p className="text-xs mt-1 text-neutral-600">Add tasks below and allocate pomodoro cycles.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isActive = activeTaskId === task.id;
            return (
              <div
                key={task.id}
                className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-500/10 border-rose-500/40 shadow-sm'
                    : 'bg-neutral-900/90 border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                {/* Complete checkbox and title */}
                <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className="text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer shrink-0"
                    title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                  >
                    {task.completed ? (
                      <CheckCircle2 size={20} className="text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>

                  <div
                    onClick={() => onSelectActiveTask(isActive ? null : task.id)}
                    className="cursor-pointer flex-1 min-w-0"
                    title="Click to set as current focus task"
                  >
                    <p
                      className={`text-sm font-medium truncate ${
                        task.completed
                          ? 'line-through text-neutral-500'
                          : isActive
                          ? 'text-rose-300 font-semibold'
                          : 'text-neutral-200'
                      }`}
                    >
                      {task.title}
                    </p>
                    {isActive && (
                      <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider">
                        Current Focus
                      </span>
                    )}
                  </div>
                </div>

                {/* Pomodoro count indicator & delete */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-300"
                    title={`${task.actualPomodoroCount} completed of ${task.estPomodoroCount} estimated`}
                  >
                    {task.actualPomodoroCount}/{task.estPomodoroCount} 🍅
                  </span>
                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="text-neutral-600 hover:text-rose-400 p-1 rounded-lg opacity-60 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Delete task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Trigger / Form */}
      <div className="mt-4 pt-3 border-t border-neutral-800">
        {!isAdding ? (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-neutral-700 hover:border-neutral-500 text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-2 text-sm font-medium transition-colors cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 p-3 bg-neutral-950/80 rounded-2xl border border-neutral-700/80">
            <input
              type="text"
              autoFocus
              placeholder="What are you working on?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700/60 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span>Est. Pomodoros:</span>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={est}
                  onChange={(e) => setEst(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 bg-neutral-900 border border-neutral-700/60 rounded-lg px-2 py-1 text-center text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setTitle('');
                  }}
                  className="px-3 py-1.5 text-xs text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim()}
                  className="px-4 py-1.5 text-xs font-semibold bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
