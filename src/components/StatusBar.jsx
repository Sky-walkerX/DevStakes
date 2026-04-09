import React from 'react';
import { Check, Loader2, AlertCircle, Clock, Type, Hash } from 'lucide-react';
import { getWordCount, getReadTime } from '../utils/markdown';

export default function StatusBar({ saveStatus, content, note }) {
  const words = getWordCount(content);
  const readTime = getReadTime(content);
  const chars = content ? content.length : 0;
  const lines = content ? content.split('\n').length : 0;

  const statusConfig = {
    saved: { icon: Check, label: 'Saved', color: 'text-accent-500' },
    saving: { icon: Loader2, label: 'Saving…', color: 'text-ink-400 dark:text-ink-500', spin: true },
    unsaved: { icon: AlertCircle, label: 'Unsaved', color: 'text-amber-500' },
  };

  const s = statusConfig[saveStatus] || statusConfig.saved;
  const Icon = s.icon;

  return (
    <div className="flex items-center justify-between px-4 py-1 border-t border-ink-100 dark:border-dark-border bg-paper-50 dark:bg-dark-bg flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1 text-[11px] ${s.color}`}>
          <Icon size={11} className={s.spin ? 'animate-spin' : ''} />
          {s.label}
        </div>

        {note?.tags?.length > 0 && (
          <div className="flex items-center gap-1">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-1.5 py-0.5 bg-ink-100 dark:bg-dark-surface rounded text-ink-500 dark:text-ink-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[11px] text-ink-300 dark:text-ink-600">
        <span className="flex items-center gap-1">
          <Type size={10} /> {words} words
        </span>
        <span>{chars} chars</span>
        <span>{lines} lines</span>
        {readTime > 0 && (
          <span className="flex items-center gap-1">
            <Clock size={10} /> {readTime} min read
          </span>
        )}
      </div>
    </div>
  );
}
