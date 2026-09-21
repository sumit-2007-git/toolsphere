import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { CheckSquare, Square, Trash2, Plus, CheckCircle2, Flag } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
}

export const TodoList: React.FC = () => {
  const { addToast } = useApp();
  const [todos, setTodos] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('toolsphere_todos');
      return saved ? JSON.parse(saved) : [
        { id: '1', text: 'Review quarterly financial report PDF', completed: false, priority: 'high', createdAt: Date.now() },
        { id: '2', text: 'Compress project assets for client email', completed: true, priority: 'medium', createdAt: Date.now() - 3600000 },
        { id: '3', text: 'Generate new secure WiFi QR code', completed: false, priority: 'low', createdAt: Date.now() - 7200000 }
      ];
    } catch {
      return [];
    }
  });

  const [inputText, setInputText] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    localStorage.setItem('toolsphere_todos', JSON.stringify(todos));
  }, [todos]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newTodo: TodoItem = {
      id: Math.random().toString(36).substring(2, 9),
      text: inputText.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTodos([newTodo, ...todos]);
    setInputText('');
    addToast('success', 'Task added!');
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed));
    addToast('info', 'Completed tasks removed');
  };

  const completedCount = todos.filter(t => t.completed).length;
  const progressPercent = todos.length > 0 ? Math.round((completedCount / todos.length) * 100) : 0;

  const filteredTodos = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Task Completion Progress</span>
          <span>{completedCount} of {todos.length} Done ({progressPercent}%)</span>
        </div>
        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Add Task Form */}
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What needs to be done today?"
          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />

        <div className="flex items-center gap-2">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low Priority</option>
          </select>

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/20 text-xs sm:text-sm shrink-0 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {/* Filter Tabs & Todo items list */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            {(['all', 'active', 'completed'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  filter === f
                    ? 'bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {completedCount > 0 && (
            <button
              type="button"
              onClick={clearCompleted}
              className="text-xs text-red-500 hover:text-red-600 font-medium"
            >
              Clear Completed
            </button>
          )}
        </div>

        {/* Task rows */}
        <div className="space-y-2">
          {filteredTodos.length > 0 ? (
            filteredTodos.map(todo => {
              let priorityBadge = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
              if (todo.priority === 'high') priorityBadge = 'bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300';
              if (todo.priority === 'medium') priorityBadge = 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300';

              return (
                <div
                  key={todo.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                    todo.completed
                      ? 'border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/40 opacity-60'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300'
                  }`}
                >
                  <div
                    onClick={() => toggleComplete(todo.id)}
                    className="flex items-center gap-3 min-w-0 pr-3 cursor-pointer select-none flex-1"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-400 hover:text-brand-500 shrink-0" />
                    )}
                    <span
                      className={`text-sm font-medium truncate ${
                        todo.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {todo.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${priorityBadge}`}>
                      {todo.priority}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeTodo(todo.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              No tasks found in this view.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
