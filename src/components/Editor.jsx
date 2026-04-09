import React, { forwardRef, useEffect, useCallback } from 'react';

const TAB_SIZE = 2;

const Editor = forwardRef(function Editor({ content, onChange }, ref) {
  const handleKeyDown = useCallback((e) => {
    const el = e.target;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;

    if (e.key === 'Tab') {
      e.preventDefault();
      const spaces = ' '.repeat(TAB_SIZE);
      el.value = val.slice(0, start) + spaces + val.slice(end);
      el.selectionStart = el.selectionEnd = start + TAB_SIZE;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      return;
    }

    if (e.key === 'Enter') {
      const lineStart = val.lastIndexOf('\n', start - 1) + 1;
      const line = val.slice(lineStart, start);
      const taskMatch = line.match(/^(\s*)(- \[[ x]\])\s/);
      const bulletMatch = line.match(/^(\s*)([-*+]|\d+\.)\s/);
      const blockquoteMatch = line.match(/^(>\s)/);

      if (taskMatch) {
        e.preventDefault();
        const insert = `\n${taskMatch[1]}- [ ] `;
        el.value = val.slice(0, start) + insert + val.slice(end);
        el.selectionStart = el.selectionEnd = start + insert.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      if (bulletMatch) {
        const itemContent = line.slice(bulletMatch[0].length);
        if (!itemContent.trim()) {
          e.preventDefault();
          el.value = val.slice(0, lineStart) + '\n' + val.slice(end);
          el.selectionStart = el.selectionEnd = lineStart + 1;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
        e.preventDefault();
        const indent = bulletMatch[1];
        const marker = bulletMatch[2];
        const nextMarker = /^\d+\./.test(marker) ? `${parseInt(marker) + 1}.` : marker;
        const insert = `\n${indent}${nextMarker} `;
        el.value = val.slice(0, start) + insert + val.slice(end);
        el.selectionStart = el.selectionEnd = start + insert.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      if (blockquoteMatch) {
        e.preventDefault();
        const insert = `\n> `;
        el.value = val.slice(0, start) + insert + val.slice(end);
        el.selectionStart = el.selectionEnd = start + insert.length;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
    }

    if (e.ctrlKey || e.metaKey) {
      const sel = val.slice(start, end);
      let insert;
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          el.value = val.slice(0, start) + '**' + (sel || 'bold') + '**' + val.slice(end);
          el.selectionStart = start + 2;
          el.selectionEnd = start + 2 + (sel || 'bold').length;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        case 'i':
          e.preventDefault();
          el.value = val.slice(0, start) + '_' + (sel || 'italic') + '_' + val.slice(end);
          el.selectionStart = start + 1;
          el.selectionEnd = start + 1 + (sel || 'italic').length;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        case 'k':
          e.preventDefault();
          insert = `[${sel || 'link text'}](url)`;
          el.value = val.slice(0, start) + insert + val.slice(end);
          el.selectionStart = start + insert.indexOf('url');
          el.selectionEnd = start + insert.indexOf('url') + 3;
          el.dispatchEvent(new Event('input', { bubbles: true }));
          return;
      }
    }
  }, []);

  const handleInput = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <textarea
        ref={ref}
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        spellCheck={true}
        className="w-full min-h-full p-8 bg-transparent text-ink-900 dark:text-[#c8c0aa] font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-ink-200 dark:placeholder-[#4a4238]"
        placeholder={`# Note title\n\nStart writing in Markdown...\n\n- Use **bold**, _italic_, \`code\`\n- Create [links](url)\n- Add #tags anywhere\n- [ ] Task lists`}
        style={{ minHeight: '100%' }}
      />
    </div>
  );
});

export default Editor;
