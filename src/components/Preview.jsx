import React, { useEffect, useRef } from 'react';
import { parseMarkdown } from '../utils/markdown';
import 'highlight.js/styles/github-dark.min.css';

export default function Preview({ content }) {
  const containerRef = useRef(null);
  const html = parseMarkdown(content);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.removeAttribute('disabled'));
  }, [html]);

  if (!content) {
    return (
      <div className="flex-1 flex items-center justify-center text-ink-200 dark:text-[#4a4238] p-8">
        <p className="text-sm italic">Nothing to preview yet.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto h-full">
      <div
        ref={containerRef}
        className="prose prose-sm max-w-none p-8
          prose-headings:font-mono prose-headings:font-bold prose-headings:tracking-tight
          prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
          prose-code:bg-ink-100 dark:prose-code:bg-[#1a1712] prose-code:px-1 prose-code:py-0.5 prose-code:rounded
          prose-blockquote:border-l-4 prose-blockquote:border-[#527a59] prose-blockquote:not-italic prose-blockquote:bg-ink-50
          prose-a:text-[#527a59] dark:prose-a:text-[#6b8f71]
          prose-hr:border-ink-200
          text-ink-800 dark:text-[#c8c0aa]
          prose-headings:text-ink-900 dark:prose-headings:text-[#e8e0ca]
          prose-strong:text-ink-900 dark:prose-strong:text-[#e8e0ca]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
