import React, { useRef, useState, useEffect, forwardRef } from 'react';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Editor from './components/Editor';
import Preview from './components/Preview';
import StatusBar from './components/StatusBar';
import EmptyState from './components/EmptyState';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';

const WELCOME_NOTE = `# Welcome to inkpad ✦

A distraction-free, offline-first markdown editor.

## Features

- **Real-time** markdown preview
- **Offline-first** — works without internet, never loses a keystroke
- **Syntax highlighting** for code blocks
- **Auto-save** to IndexedDB — persists across sessions
- **Tags** — just write #tagname anywhere
- **Task lists**, tables, blockquotes & more

## Code Example

\`\`\`javascript
// Fibonacci with memoization
const fib = (n, memo = {}) => {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  return memo[n] = fib(n - 1, memo) + fib(n - 2, memo);
};
console.log(fib(40)); // 102334155
\`\`\`

## Task List

- [x] Create a note
- [x] Write in Markdown
- [ ] Share with the world

> "The best tool is the one that gets out of your way."

#welcome #markdown #notes
`;

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return isOnline;
}

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const isOnline = useOnlineStatus();
  const {
    notes, activeNote, activeId, setActiveId, loading, saveStatus,
    createNote, updateNote, removeNote, togglePin, duplicateNote,
  } = useNotes();

  const [mode, setMode] = useState('split');
  const editorRef = useRef(null);

  useEffect(() => {
    if (!loading && notes.length === 0) {
      createNote(WELCOME_NOTE);
    }
  }, [loading, notes.length]);

  const handleContentChange = (val) => {
    if (activeId) updateNote(activeId, val);
  };

  const handleExport = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title || 'note'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-paper-100 dark:bg-[#12100e]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-ink-200 border-t-ink-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-ink-400 font-mono">Loading notes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-paper-100 dark:bg-[#12100e] font-sans">
      <Sidebar
        notes={notes}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={() => createNote('')}
        onPin={togglePin}
        onDelete={removeNote}
        onDuplicate={duplicateNote}
        theme={theme}
        onToggleTheme={toggleTheme}
        isOnline={isOnline}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeNote ? (
          <>
            <Toolbar
              editorRef={editorRef}
              mode={mode}
              onModeChange={setMode}
              noteTitle={activeNote.title}
              onExport={handleExport}
            />

            <div className="flex-1 flex overflow-hidden bg-white dark:bg-[#12100e]">
              {(mode === 'edit' || mode === 'split') && (
                <div className={`flex flex-col overflow-hidden border-ink-100 dark:border-[#2a2520] ${mode === 'split' ? 'w-1/2 border-r' : 'w-full'}`}>
                  <Editor
                    ref={editorRef}
                    content={activeNote.content}
                    onChange={handleContentChange}
                  />
                </div>
              )}

              {(mode === 'preview' || mode === 'split') && (
                <div className={`flex flex-col overflow-hidden ${mode === 'split' ? 'w-1/2' : 'w-full'}`}>
                  <Preview content={activeNote.content} />
                </div>
              )}
            </div>

            <StatusBar
              saveStatus={saveStatus}
              content={activeNote.content}
              note={activeNote}
            />
          </>
        ) : (
          <EmptyState onNew={() => createNote('')} />
        )}
      </main>

      {!isOnline && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg shadow-lg text-xs text-amber-700 z-50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Offline — changes saved locally
        </div>
      )}
    </div>
  );
}
