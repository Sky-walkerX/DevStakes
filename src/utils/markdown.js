import { marked, Renderer } from 'marked';
import hljs from 'highlight.js';

// marked v5+ uses markedHighlight extension
const renderer = new Renderer();

renderer.heading = function({ text, depth }) {
  const id = text.toLowerCase().replace(/[^\w]+/g, '-');
  return `<h${depth} id="${id}">${text}</h${depth}>\n`;
};

renderer.link = function({ href, title, text }) {
  const isExternal = href && (href.startsWith('http') || href.startsWith('//'));
  const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
  const titleAttr = title ? ` title="${title}"` : '';
  return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
};

renderer.listitem = function({ text, task, checked }) {
  if (task) {
    return `<li class="task-item"><input type="checkbox" ${checked ? 'checked' : ''} disabled/> ${text}</li>\n`;
  }
  return `<li>${text}</li>\n`;
};

renderer.code = function({ text, lang }) {
  const language = lang && hljs.getLanguage(lang) ? lang : null;
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value;
  return `<pre><code class="hljs language-${language || 'plaintext'}">${highlighted}</code></pre>\n`;
};

marked.setOptions({ gfm: true, breaks: true });
marked.use({ renderer });

export function parseMarkdown(content) {
  if (!content) return '';
  try {
    return marked.parse(content);
  } catch (e) {
    return `<p>${content}</p>`;
  }
}

export function extractTitle(content) {
  if (!content) return 'Untitled';
  const firstLine = content.split('\n')[0];
  if (firstLine.startsWith('#')) {
    return firstLine.replace(/^#+\s*/, '').trim() || 'Untitled';
  }
  return firstLine.trim().substring(0, 60) || 'Untitled';
}

export function extractTags(content) {
  const tagRegex = /#([a-zA-Z][a-zA-Z0-9_-]*)/g;
  const tags = new Set();
  for (const match of content.matchAll(tagRegex)) tags.add(match[1]);
  return Array.from(tags);
}

export function getWordCount(content) {
  if (!content) return 0;
  return content.trim().split(/\s+/).filter(Boolean).length;
}

export function getReadTime(content) {
  return Math.ceil(getWordCount(content) / 200);
}
