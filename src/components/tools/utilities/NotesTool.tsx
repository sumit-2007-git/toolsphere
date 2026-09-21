import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { StickyNote, Plus, Trash2, Download, Copy, Save } from 'lucide-react';
import { downloadBlob } from '../../../utils/fileUtils';

interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
}

export const NotesTool: React.FC = () => {
  const { addToast } = useApp();
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem('toolsphere_notes');
      return saved ? JSON.parse(saved) : [
        {
          id: '1',
          title: 'Quick Scratchpad',
          body: '# Quick Notes\n\nWelcome to ToolSphere Quick Notes!\n- Auto-saved instantly to your local browser storage\n- Never lost upon refreshing\n- Easily export to .txt or Markdown format.',
          updatedAt: Date.now()
        }
      ];
    } catch {
      return [];
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || '1');

  useEffect(() => {
    localStorage.setItem('toolsphere_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId) || notes[0];

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 9),
      title: `Note ${notes.length + 1}`,
      body: '',
      updatedAt: Date.now(),
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    addToast('success', 'New note created');
  };

  const handleUpdateActive = (field: 'title' | 'body', value: string) => {
    if (!activeNote) return;
    setNotes(notes.map(n => (n.id === activeNote.id ? { ...n, [field]: value, updatedAt: Date.now() } : n)));
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (notes.length <= 1) {
      addToast('error', 'Cannot delete the only remaining note.');
      return;
    }
    const filtered = notes.filter(n => n.id !== id);
    setNotes(filtered);
    if (activeNoteId === id) {
      setActiveNoteId(filtered[0].id);
    }
    addToast('info', 'Note removed');
  };

  const handleExport = (format: 'txt' | 'md') => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.body], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${activeNote.title.toLowerCase().replace(/\s+/g, '_')}.${format}`);
    addToast('success', `Exported note as .${format}`);
  };

  const handleCopy = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.body);
    addToast('success', 'Note content copied to clipboard!');
  };

  const wordCount = activeNote ? activeNote.body.split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote ? activeNote.body.length : 0;

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Sidebar List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 md:col-span-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">All Notes</span>
            <button
              type="button"
              onClick={handleCreateNote}
              className="p-1 rounded-lg bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 hover:bg-brand-100"
              title="New Note"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
            {notes.map(n => (
              <div
                key={n.id}
                onClick={() => setActiveNoteId(n.id)}
                className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                  activeNoteId === n.id
                    ? 'bg-brand-50 dark:bg-brand-950/60 font-bold text-brand-700 dark:text-brand-300'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <span className="truncate flex-1 pr-2">{n.title || 'Untitled'}</span>
                {notes.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => handleDeleteNote(n.id, e)}
                    className="opacity-40 hover:opacity-100 text-red-500"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 text-[10px] text-slate-400 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1">
          <Save className="w-3 h-3 text-emerald-500" />
          <span>Auto-saved to browser</span>
        </div>
      </div>

      {/* Editor Main */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 md:col-span-3">
        {activeNote ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <input
                type="text"
                value={activeNote.title}
                onChange={(e) => handleUpdateActive('title', e.target.value)}
                placeholder="Note Title..."
                className="text-lg font-bold bg-transparent text-slate-900 dark:text-white focus:outline-none flex-1"
              />

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  title="Copy note"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('txt')}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  .txt
                </button>
                <button
                  type="button"
                  onClick={() => handleExport('md')}
                  className="px-2.5 py-1.5 rounded-lg bg-brand-600 text-white text-xs font-semibold hover:bg-brand-500 shadow-2xs"
                >
                  .md
                </button>
              </div>
            </div>

            <textarea
              rows={14}
              value={activeNote.body}
              onChange={(e) => handleUpdateActive('body', e.target.value)}
              placeholder="Start writing notes, ideas, code snippets, or draft..."
              className="w-full bg-transparent text-sm leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none font-sans resize-y"
            />

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{wordCount} words • {charCount} characters</span>
              <span>Last updated: {new Date(activeNote.updatedAt).toLocaleTimeString()}</span>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-slate-400">No active note selected</div>
        )}
      </div>
    </div>
  );
};
