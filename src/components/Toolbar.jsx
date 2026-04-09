import React from 'react';
import {
  Bold, Italic, Code, Link, List, ListOrdered, Quote,
  Heading1, Heading2, Heading3, Minus, CheckSquare, Eye, Edit3,
  Download, Hash, Table
} from 'lucide-react';

function ToolbarButton({ icon: Icon, title, onClick, active }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors text-ink-400 dark:text-ink-500 ${
        active
          ? 'bg-ink-100 dark:bg-dark-surface text-ink-700 dark:text-dark-text'
          : 'hover:bg-ink-50 dark:hover:bg-dark-surface hover:text-ink-700 dark:hover:text-dark-text'
      }`}
    >
      <Icon size={14} />
    </button>
  );
}

function Divider() {
  return <div className="w-px h-4 bg-ink-200 dark:bg-dark-border mx-0.5" />;
}

export default function Toolbar({ editorRef, mode, onModeChange, noteTitle, onExport }) {
  function wrap(before, after = '') {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end);
    const replacement = before + (selected || 'text') + after;
    const newVal = el.value.slice(0, start) + replacement + el.value.slice(end);
    el.value = newVal;
    el.focus();
    el.setSelectionRange(start + before.length, start + before.length + (selected || 'text').length);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function insertLine(prefix) {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const lineStart = el.value.lastIndexOf('\n', start - 1) + 1;
    const newVal = el.value.slice(0, lineStart) + prefix + el.value.slice(lineStart);
    el.value = newVal;
    el.focus();
    el.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  function insertSnippet(snippet) {
    const el = editorRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const newVal = el.value.slice(0, start) + snippet + el.value.slice(start);
    el.value = newVal;
    el.focus();
    const pos = start + snippet.indexOf('\n') + 1 || start + snippet.length;
    el.setSelectionRange(pos, pos);
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }

  const tools = [
    { icon: Heading1, title: 'Heading 1 (Ctrl+1)', action: () => insertLine('# ') },
    { icon: Heading2, title: 'Heading 2 (Ctrl+2)', action: () => insertLine('## ') },
    { icon: Heading3, title: 'Heading 3 (Ctrl+3)', action: () => insertLine('### ') },
    'divider',
    { icon: Bold, title: 'Bold (Ctrl+B)', action: () => wrap('**', '**') },
    { icon: Italic, title: 'Italic (Ctrl+I)', action: () => wrap('_', '_') },
    { icon: Code, title: 'Inline Code', action: () => wrap('`', '`') },
    { icon: Link, title: 'Link (Ctrl+K)', action: () => wrap('[', '](url)') },
    'divider',
    { icon: List, title: 'Bullet List', action: () => insertLine('- ') },
    { icon: ListOrdered, title: 'Numbered List', action: () => insertLine('1. ') },
    { icon: CheckSquare, title: 'Task Item', action: () => insertLine('- [ ] ') },
    { icon: Quote, title: 'Blockquote', action: () => insertLine('> ') },
    'divider',
    { icon: Minus, title: 'Horizontal Rule', action: () => insertSnippet('\n---\n') },
    {
      icon: Table,
      title: 'Insert Table',
      action: () =>
        insertSnippet(
          '\n| Column 1 | Column 2 | Column 3 |\n|----------|----------|----------|\n| Cell 1   | Cell 2   | Cell 3   |\n'
        ),
    },
    {
      icon: Hash,
      title: 'Code Block',
      action: () => insertSnippet('\n```js\n// your code here\n```\n'),
    },
  ];

  return (
    <div className="flex items-center justify-between px-3 py-1.5 border-b border-ink-100 dark:border-dark-border bg-paper-50 dark:bg-dark-bg flex-shrink-0">
      <div className="flex items-center gap-0.5">
        {tools.map((t, i) =>
          t === 'divider' ? (
            <Divider key={i} />
          ) : (
            <ToolbarButton key={t.title} icon={t.icon} title={t.title} onClick={t.action} />
          )
        )}
      </div>

      <div className="flex items-center gap-1">
        <div className="flex items-center bg-ink-100 dark:bg-dark-surface rounded-md p-0.5 gap-0.5">
          <button
            onClick={() => onModeChange('edit')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              mode === 'edit'
                ? 'bg-white dark:bg-dark-bg text-ink-800 dark:text-dark-text shadow-sm'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-dark-text'
            }`}
          >
            <Edit3 size={11} /> Edit
          </button>
          <button
            onClick={() => onModeChange('split')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              mode === 'split'
                ? 'bg-white dark:bg-dark-bg text-ink-800 dark:text-dark-text shadow-sm'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-dark-text'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => onModeChange('preview')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
              mode === 'preview'
                ? 'bg-white dark:bg-dark-bg text-ink-800 dark:text-dark-text shadow-sm'
                : 'text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-dark-text'
            }`}
          >
            <Eye size={11} /> Preview
          </button>
        </div>

        <button
          onClick={onExport}
          title="Export as Markdown"
          className="p-1.5 rounded hover:bg-ink-100 dark:hover:bg-dark-surface text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-dark-text transition-colors"
        >
          <Download size={14} />
        </button>
      </div>
    </div>
  );
}
