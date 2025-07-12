import { describe, it, expect } from 'vitest';
import { parseMarkdown, extractOutline, type Outline } from '../../../src/lib/utils/markdown';

describe('Markdown Utilities', () => {
  describe('parseMarkdown', () => {
    it('should parse basic markdown', () => {
      const markdown = '# Hello World\n\nThis is a **bold** text.';
      const html = parseMarkdown(markdown);

      expect(html).toContain('<h1>Hello World</h1>');
      expect(html).toContain('<strong>bold</strong>');
    });

    it('should parse code blocks with syntax highlighting', () => {
      const markdown = '```javascript\nconst hello = "world";\n```';
      const html = parseMarkdown(markdown);

      expect(html).toContain('<pre>');
      expect(html).toContain('<code');
      expect(html).toContain('language-javascript');
    });

    it('should parse tables', () => {
      const markdown = `
| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |
`;
      const html = parseMarkdown(markdown);

      expect(html).toContain('<table>');
      expect(html).toContain('<thead>');
      expect(html).toContain('<tbody>');
    });

    it('should handle empty input', () => {
      const html = parseMarkdown('');
      expect(html).toBe('');
    });
  });

  describe('extractOutline', () => {
    it('should extract headings as outline', () => {
      const markdown = `
# Title
## Subtitle 1
### Sub-subtitle 1
## Subtitle 2
### Sub-subtitle 2
#### Deep subtitle
`;
      const outline = extractOutline(markdown);

      expect(outline).toHaveLength(1);
      expect(outline[0]).toMatchObject({
        level: 1,
        text: 'Title',
        line: 2,
      });

      expect(outline[0].children).toHaveLength(2);
      expect(outline[0].children![0]).toMatchObject({
        level: 2,
        text: 'Subtitle 1',
        line: 3,
      });

      expect(outline[0].children![0].children).toHaveLength(1);
      expect(outline[0].children![0].children![0]).toMatchObject({
        level: 3,
        text: 'Sub-subtitle 1',
        line: 4,
      });
    });

    it('should handle multiple h1 headings', () => {
      const markdown = `
# First Title
## Subtitle
# Second Title
## Another Subtitle
`;
      const outline = extractOutline(markdown);

      expect(outline).toHaveLength(2);
      expect(outline[0].text).toBe('First Title');
      expect(outline[1].text).toBe('Second Title');
    });

    it('should skip headings in code blocks', () => {
      const markdown = `
# Real Heading
\`\`\`
# This is not a heading
\`\`\`
## Real Subheading
`;
      const outline = extractOutline(markdown);

      expect(outline).toHaveLength(1);
      expect(outline[0].children).toHaveLength(1);
      expect(outline[0].children![0].text).toBe('Real Subheading');
    });

    it('should handle empty input', () => {
      const outline = extractOutline('');
      expect(outline).toEqual([]);
    });

    it('should generate unique IDs for headings', () => {
      const markdown = `
# Title
# Title
# Title
`;
      const outline = extractOutline(markdown);

      const ids = outline.map((item: Outline) => item.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
