<script lang="ts">
  import type { Outline } from '$lib/types/editor';

  export let content: string = '';
  export let activeHeading: string = '';

  let outline: Outline[] = [];

  function extractOutline(markdown: string): Outline[] {
    const lines = markdown.split('\n');
    const headings: Outline[] = [];
    let currentId = 0;

    lines.forEach((line, index) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const level = match[1]?.length || 1;
        const text = match[2] || '';
        headings.push({
          id: `heading-${currentId++}`,
          level,
          text,
          line: index + 1,
        });
      }
    });

    return buildHierarchy(headings);
  }

  function buildHierarchy(headings: Outline[]): Outline[] {
    const root: Outline[] = [];
    const stack: { level: number; children: Outline[] }[] = [{ level: 0, children: root }];

    headings.forEach((heading) => {
      while (stack.length > 1) {
        const lastItem = stack[stack.length - 1];
        if (lastItem && lastItem.level >= heading.level) {
          stack.pop();
        } else {
          break;
        }
      }

      const parent = stack[stack.length - 1];
      const item = { ...heading, children: [] };
      if (parent) {
        parent.children.push(item);
      }

      stack.push({ level: heading.level, children: item.children });
    });

    return root;
  }

  function handleClick(heading: Outline) {
    // ブラウザ環境でのみ実行
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      const event = new globalThis.CustomEvent('navigate', {
        detail: { line: heading.line, text: heading.text },
      });
      globalThis.dispatchEvent(event);
    }
  }

  $: outline = extractOutline(content);
</script>

<div class="outline-pane">
  <h3 class="outline-title">目次</h3>
  {#if outline.length === 0}
    <p class="empty-state">見出しがありません</p>
  {:else}
    <ul class="outline-list">
      {#each outline as item}
        <li class="outline-item">
          <button
            class="outline-link"
            class:active={activeHeading === item.text}
            style="padding-left: {(item.level - 1) * 12}px"
            on:click={() => handleClick(item)}
          >
            <span class="outline-text">{item.text}</span>
          </button>
          {#if item.children && item.children.length > 0}
            <ul class="outline-sublist">
              {#each item.children as child}
                <li class="outline-item">
                  <button
                    class="outline-link"
                    class:active={activeHeading === child.text}
                    style="padding-left: {(child.level - 1) * 12}px"
                    on:click={() => handleClick(child)}
                  >
                    <span class="outline-text">{child.text}</span>
                  </button>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .outline-pane {
    height: 100%;
    background-color: rgb(249 250 251);
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    padding: 1rem;
    overflow-y: auto;
  }

  .outline-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(55 65 81);
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .empty-state {
    color: rgb(156 163 175);
    font-size: 0.875rem;
    text-align: center;
    padding: 2rem 0;
  }

  .outline-list,
  .outline-sublist {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .outline-item {
    margin-bottom: 0.125rem;
  }

  .outline-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    color: rgb(55 65 81);
    background: none;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .outline-link:hover {
    background-color: rgb(229 231 235);
    color: rgb(17 24 39);
  }

  .outline-link.active {
    background-color: rgb(219 234 254);
    color: rgb(37 99 235);
    font-weight: 500;
  }

  .outline-text {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(.dark) .outline-pane {
    background-color: rgb(31 41 55);
    border-color: rgb(55 65 81);
  }

  :global(.dark) .outline-title {
    color: rgb(209 213 219);
  }

  :global(.dark) .outline-link {
    color: rgb(209 213 219);
  }

  :global(.dark) .outline-link:hover {
    background-color: rgb(55 65 81);
    color: rgb(243 244 246);
  }

  :global(.dark) .outline-link.active {
    background-color: rgb(37 99 235);
    color: white;
  }
</style>
