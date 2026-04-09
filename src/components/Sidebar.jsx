import React, { useState, useMemo } from 'react';
import {
  Search, Plus, Pin, PinOff, Trash2, Copy, FileText,
  Tag, Clock, ChevronRight, Moon, Sun, Wifi, WifiOff,
} from 'lucide-react';

function formatDate(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const diff = now - d;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NoteItem({ note, isActive, onSelect, onPin, onDelete, onDuplicate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const preview = note.content
    .replace(/^#+\s.+$/m, '')
    .replace(/[#*`_~]/g, '')
    .trim()
    .slice(0, 80);

  return (
    <div
      className={`group relative cursor-pointer select-none transition-all duration-150 px-3 py-3 rounded-lg mb-1 ${
        isActive
          ? 'bg-ink-100 dark:bg-dark-surface border border-ink-200 dark:border-dark-border'
          : 'hover:bg-ink-50 dark:hover:bg-dark-surface/50'
      }`}
      onClick={() => onSelect(note.id)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            {note.isPinned && (
              <Pin size={10} className="text-accent-500 flex-shrink-0 fill-accent-500" />
            )}
            <span className="font-medium text-sm text-ink-900 dark:text-dark-text truncate">
              {note.title || 'Untitled'}
            </span>
          </div>
          {preview && (
            <p className="text-xs text-ink-400 dark:text-ink-500 truncate leading-relaxed">
              {preview}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-[10px] text-ink-300 dark:text-ink-600 flex items-center gap-0.5">
              <Clock size={9} /> {formatDate(note.updatedAt)}
            </span>
            {note.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-accent-500 dark:text-accent-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onPin(note.id); }}
            className="p-1 rounded hover:bg-ink-200 dark:hover:bg-dark-border text-ink-400 hover:text-ink-700 dark:hover:text-dark-text transition-colors"
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            {note.isPinned ? <PinOff size={12} /> : <Pin size={12} />}
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDuplicate(note.id); }}
            className="p-1 rounded hover:bg-ink-200 dark:hover:bg-dark-border text-ink-400 hover:text-ink-700 dark:hover:text-dark-text transition-colors"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20 text-ink-400 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  notes,
  activeId,
  onSelect,
  onNew,
  onPin,
  onDelete,
  onDuplicate,
  theme,
  onToggleTheme,
  isOnline,
}) {
  const [query, setQuery] = useState('');
  const [filterTag, setFilterTag] = useState(null);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    notes.forEach((n) => (n.tags || []).forEach((t) => tagSet.add(t)));
    return Array.from(tagSet);
  }, [notes]);

  const filtered = useMemo(() => {
    let result = notes;
    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    if (filterTag) {
      result = result.filter((n) => (n.tags || []).includes(filterTag));
    }
    return result;
  }, [notes, query, filterTag]);

  const pinned = filtered.filter((n) => n.isPinned);
  const unpinned = filtered.filter((n) => !n.isPinned);

  return (
    <aside className="w-64 flex-shrink-0 h-full flex flex-col bg-paper-100 dark:bg-dark-bg border-r border-ink-100 dark:border-dark-border">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-ink-900 dark:bg-dark-text rounded-md flex items-center justify-center">
              <FileText size={13} className="text-paper-100 dark:text-dark-bg" />
            </div>
            <span className="font-bold text-sm tracking-tight text-ink-900 dark:text-dark-text font-mono">
              inkpad
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div
              title={isOnline ? 'Online' : 'Offline – notes saved locally'}
              className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-accent-500' : 'bg-amber-500'}`}
            />
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-md hover:bg-ink-100 dark:hover:bg-dark-surface text-ink-400 dark:text-ink-500 hover:text-ink-700 dark:hover:text-dark-text transition-colors"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-300 dark:text-ink-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-white dark:bg-dark-surface border border-ink-200 dark:border-dark-border text-ink-800 dark:text-dark-text placeholder-ink-300 dark:placeholder-ink-600 focus:outline-none focus:ring-1 focus:ring-ink-300 dark:focus:ring-dark-border transition-all"
          />
        </div>

        {/* Tags filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {allTags.slice(0, 6).map((tag) => (
              <button
                key={tag}
                onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                  filterTag === tag
                    ? 'bg-accent-500 text-white'
                    : 'bg-ink-100 dark:bg-dark-surface text-ink-500 dark:text-ink-400 hover:bg-ink-200 dark:hover:bg-dark-border'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* New note button */}
      <div className="px-3 pb-2 flex-shrink-0">
        <button
          onClick={onNew}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-ink-900 dark:bg-dark-surface hover:bg-ink-800 dark:hover:bg-dark-border text-paper-50 dark:text-dark-text text-xs font-medium transition-colors group"
        >
          <Plus size={14} className="group-hover:rotate-90 transition-transform duration-200" />
          New Note
        </button>
      </div>

      {/* Notes list */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 scrollbar-thin">
        {pinned.length > 0 && (
          <>
            <div className="px-1 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-300 dark:text-ink-600">
              Pinned
            </div>
            {pinned.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                isActive={note.id === activeId}
                onSelect={onSelect}
                onPin={onPin}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
            {unpinned.length > 0 && (
              <div className="px-1 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-300 dark:text-ink-600 mt-1">
                Notes
              </div>
            )}
          </>
        )}
        {unpinned.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isActive={note.id === activeId}
            onSelect={onSelect}
            onPin={onPin}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
          />
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-8 text-ink-300 dark:text-ink-600">
            <FileText size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-xs">{query ? 'No results' : 'No notes yet'}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-ink-100 dark:border-dark-border flex-shrink-0">
        <p className="text-[10px] text-ink-300 dark:text-ink-600">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'} · stored locally
        </p>
      </div>
    </aside>
  );
}
