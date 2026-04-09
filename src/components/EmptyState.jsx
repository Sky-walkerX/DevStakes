import React from 'react';
import { Plus, FileText } from 'lucide-react';

export default function EmptyState({ onNew }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-paper-50 dark:bg-dark-bg">
      <div className="w-16 h-16 rounded-2xl bg-ink-100 dark:bg-dark-surface flex items-center justify-center mb-5 shadow-inner">
        <FileText size={28} className="text-ink-300 dark:text-ink-600" />
      </div>
      <h2 className="text-xl font-bold text-ink-700 dark:text-dark-text font-mono mb-2">
        No note selected
      </h2>
      <p className="text-sm text-ink-400 dark:text-ink-500 max-w-xs mb-6 leading-relaxed">
        Create a new note to start writing. Everything is saved locally — works offline too.
      </p>
      <button
        onClick={onNew}
        className="flex items-center gap-2 px-5 py-2.5 bg-ink-900 dark:bg-dark-surface hover:bg-ink-800 dark:hover:bg-dark-border text-paper-50 dark:text-dark-text text-sm font-medium rounded-lg transition-colors shadow-sm"
      >
        <Plus size={16} /> New Note
      </button>

      <div className="mt-10 grid grid-cols-2 gap-3 max-w-sm w-full">
        {[
          { label: '**Bold**', desc: 'Ctrl+B' },
          { label: '_Italic_', desc: 'Ctrl+I' },
          { label: '[Link](url)', desc: 'Ctrl+K' },
          { label: '`code`', desc: 'Backticks' },
          { label: '# Heading', desc: '# syntax' },
          { label: '- [ ] Task', desc: 'Task list' },
        ].map(({ label, desc }) => (
          <div
            key={label}
            className="flex items-center justify-between px-3 py-2 bg-ink-50 dark:bg-dark-surface rounded-lg"
          >
            <code className="text-xs text-ink-600 dark:text-dark-text font-mono">{label}</code>
            <span className="text-[10px] text-ink-300 dark:text-ink-600">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
