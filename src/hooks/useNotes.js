import { useState, useEffect, useCallback, useRef } from 'react';
import { getAllNotes, saveNote, deleteNote } from '../services/db';
import { extractTitle, extractTags } from '../utils/markdown';

const AUTOSAVE_DELAY = 800;

function generateId() {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved');
  const autosaveTimer = useRef(null);
  const notesRef = useRef([]);

  // Keep ref in sync
  useEffect(() => { notesRef.current = notes; }, [notes]);

  useEffect(() => {
    getAllNotes()
      .then((all) => {
        const sorted = all.sort((a, b) => b.updatedAt - a.updatedAt);
        setNotes(sorted);
        if (sorted.length > 0) setActiveId(sorted[0].id);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const activeNote = notes.find((n) => n.id === activeId) || null;

  const createNote = useCallback(async (template = '') => {
    const id = generateId();
    const newNote = {
      id,
      title: extractTitle(template) || 'Untitled',
      content: template,
      tags: extractTags(template),
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNote(newNote);
    setNotes((prev) => [newNote, ...prev]);
    setActiveId(id);
    return id;
  }, []);

  const updateNote = useCallback((id, content) => {
    setSaveStatus('unsaved');
    const title = extractTitle(content);
    const tags = extractTags(content);

    setNotes((prev) =>
      prev.map((n) => n.id === id ? { ...n, content, title, tags } : n)
    );

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => {
      setSaveStatus('saving');
      const note = notesRef.current.find((n) => n.id === id);
      if (note) {
        saveNote({ ...note, content, title, tags, updatedAt: Date.now() })
          .then(() => setSaveStatus('saved'))
          .catch(() => setSaveStatus('unsaved'));
      }
    }, AUTOSAVE_DELAY);
  }, []);

  const removeNote = useCallback(async (id) => {
    await deleteNote(id);
    setNotes((prev) => {
      const remaining = prev.filter((n) => n.id !== id);
      if (activeId === id) setActiveId(remaining[0]?.id || null);
      return remaining;
    });
  }, [activeId]);

  const togglePin = useCallback(async (id) => {
    setNotes((prev) => {
      const note = prev.find((n) => n.id === id);
      if (!note) return prev;
      const updated = { ...note, isPinned: !note.isPinned };
      saveNote(updated);
      return prev.map((n) => n.id === id ? updated : n);
    });
  }, []);

  const duplicateNote = useCallback(async (id) => {
    const note = notesRef.current.find((n) => n.id === id);
    if (!note) return;
    const newId = generateId();
    const dup = { ...note, id: newId, title: note.title + ' (copy)', createdAt: Date.now(), updatedAt: Date.now() };
    await saveNote(dup);
    setNotes((prev) => [dup, ...prev]);
    setActiveId(newId);
  }, []);

  const sortedNotes = [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return {
    notes: sortedNotes,
    activeNote,
    activeId,
    setActiveId,
    loading,
    saveStatus,
    createNote,
    updateNote,
    removeNote,
    togglePin,
    duplicateNote,
  };
}
