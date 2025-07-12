import { marked } from 'marked';

export interface Outline {
  id: string;
  level: number;
  text: string;
  line: number;
  children?: Outline[];
}

export function parseMarkdown(markdown: string): string {
  if (!markdown) return '';

  // Configure marked options
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  return marked(markdown);
}

export function extractOutline(markdown: string): Outline[] {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const headings: Outline[] = [];
  const stack: Outline[] = [];
  let inCodeBlock = false;
  let headingCounter = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for code block
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Check for heading
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      headingCounter++;

      const heading: Outline = {
        id: `heading-${headingCounter}`,
        level,
        text,
        line: i + 1,
        children: [],
      };

      // Find parent
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }

      if (stack.length === 0) {
        headings.push(heading);
      } else {
        const parent = stack[stack.length - 1];
        if (!parent.children) parent.children = [];
        parent.children.push(heading);
      }

      stack.push(heading);
    }
  }

  return headings;
}
