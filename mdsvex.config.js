import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { createHighlighter } from 'shiki';

const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],

  highlight: {
    async highlighter(code, lang) {
      try {
        const highlighter = await createHighlighter({
          themes: ['github-light', 'github-dark'],
          langs: [
            'javascript',
            'typescript',
            'rust',
            'python',
            'bash',
            'json',
            'html',
            'css',
            'svelte',
          ],
        });

        const light = highlighter.codeToHtml(code, {
          lang,
          theme: 'github-light',
        });

        const dark = highlighter.codeToHtml(code, {
          lang,
          theme: 'github-dark',
        });

        return `<div class="code-wrapper" data-theme="light">${light}</div><div class="code-wrapper" data-theme="dark">${dark}</div>`;
      } catch (error) {
        return `<pre><code>${code}</code></pre>`;
      }
    },
  },

  smartypants: {
    dashes: 'oldschool',
  },

  remarkPlugins: [],
  rehypePlugins: [],
});

export default config;
