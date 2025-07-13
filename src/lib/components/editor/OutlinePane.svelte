<script lang="ts">
  import type { Outline } from '$lib/types/editor';
  import { dndzone } from 'svelte-dnd-action';
  import { flip } from 'svelte/animate';

  export let content: string = '';
  export let activeHeading: string = '';
  export let onReorder: ((_content: string) => void) | undefined = undefined;

  let outline: Outline[] = [];
  let collapsedItems: Set<string> = new Set();
  let _draggedItem: Outline | null = null;

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

  function flattenOutline(items: Outline[]): Outline[] {
    const flattened: Outline[] = [];

    function traverse(item: Outline) {
      flattened.push(item);
      if (item.children) {
        item.children.forEach(traverse);
      }
    }

    items.forEach(traverse);
    return flattened;
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

  function toggleCollapse(id: string) {
    if (collapsedItems.has(id)) {
      collapsedItems.delete(id);
    } else {
      collapsedItems.add(id);
    }
    collapsedItems = new Set(collapsedItems);
  }

  function handleDndConsider(e: CustomEvent<any>) {
    outline = e.detail.items;
  }

  function handleDndFinalize(e: CustomEvent<any>) {
    outline = e.detail.items;

    if (onReorder) {
      // アウトラインの順序に基づいてコンテンツを再構築
      const lines = content.split('\n');
      const flatOutline = flattenOutline(outline);
      const newLines: string[] = [];
      let processedLines = new Set<number>();

      // 各見出しとその内容を新しい順序で追加
      flatOutline.forEach((heading, index) => {
        const startLine = heading.line - 1;

        // 見出し行を追加
        if (!processedLines.has(startLine)) {
          newLines.push(lines[startLine] || '');
          processedLines.add(startLine);

          // 次の見出しまでの内容を追加
          let endLine = lines.length;
          for (let i = index + 1; i < flatOutline.length; i++) {
            if (flatOutline[i] && flatOutline[i]!.line - 1 > startLine) {
              endLine = flatOutline[i]!.line - 1;
              break;
            }
          }

          for (let i = startLine + 1; i < endLine; i++) {
            if (!processedLines.has(i)) {
              newLines.push(lines[i] || '');
              processedLines.add(i);
            }
          }
        }
      });

      // 見出し以外の行（ファイルの先頭部分など）を追加
      lines.forEach((line, index) => {
        if (!processedLines.has(index)) {
          newLines.unshift(line);
        }
      });

      const newContent = newLines.join('\n');
      onReorder(newContent);
    }
  }

  $: outline = extractOutline(content);
</script>

<div class="outline-pane">
  <h3 class="outline-title">目次</h3>
  {#if outline.length === 0}
    <p class="empty-state">見出しがありません</p>
  {:else}
    <div
      class="outline-list"
      use:dndzone={{
        items: outline,
        flipDurationMs: 300,
        dropTargetStyle: {
          outline: '2px dashed rgb(59, 130, 246)',
          borderRadius: '0.25rem',
        },
      }}
      on:consider={handleDndConsider}
      on:finalize={handleDndFinalize}
    >
      {#each outline as item (item.id)}
        <div animate:flip={{ duration: 300 }} class="outline-item-wrapper">
          <div class="outline-item">
            <div class="outline-item-content">
              {#if item.children && item.children.length > 0}
                <button
                  class="collapse-button"
                  on:click={() => toggleCollapse(item.id)}
                  aria-label={collapsedItems.has(item.id) ? '展開' : '折りたたむ'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class:collapsed={collapsedItems.has(item.id)}
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              {:else}
                <div class="collapse-placeholder"></div>
              {/if}

              <button
                class="outline-link"
                class:active={activeHeading === item.text}
                style="padding-left: {(item.level - 1) * 12}px"
                on:click={() => handleClick(item)}
                draggable="true"
                on:dragstart={() => (_draggedItem = item)}
                on:dragend={() => (_draggedItem = null)}
              >
                <svg
                  class="drag-handle"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                  <circle cx="19" cy="5" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="19" cy="19" r="1"></circle>
                  <circle cx="5" cy="5" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                  <circle cx="5" cy="19" r="1"></circle>
                </svg>
                <span class="outline-text">{item.text}</span>
              </button>
            </div>

            {#if item.children && item.children.length > 0 && !collapsedItems.has(item.id)}
              <div class="outline-sublist">
                {#each item.children as child}
                  <div class="outline-item">
                    <div class="outline-item-content">
                      <div class="collapse-placeholder"></div>
                      <button
                        class="outline-link"
                        class:active={activeHeading === child.text}
                        style="padding-left: {(child.level - 1) * 12}px"
                        on:click={() => handleClick(child)}
                      >
                        <span class="outline-text">{child.text}</span>
                      </button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
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

  .outline-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .outline-item-wrapper {
    margin-bottom: 0.125rem;
  }

  .outline-item {
    position: relative;
  }

  .outline-item-content {
    display: flex;
    align-items: center;
    position: relative;
  }

  .collapse-button {
    position: absolute;
    left: -20px;
    background: none;
    border: none;
    padding: 4px;
    cursor: pointer;
    color: rgb(107 114 128);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: all 0.15s ease;
  }

  .collapse-button:hover {
    background-color: rgb(229 231 235);
    color: rgb(55 65 81);
  }

  .collapse-button svg {
    transition: transform 0.2s ease;
  }

  .collapse-button svg.collapsed {
    transform: rotate(90deg);
  }

  .collapse-placeholder {
    width: 20px;
    flex-shrink: 0;
  }

  .outline-sublist {
    margin-left: 1rem;
    margin-top: 0.125rem;
  }

  .outline-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
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
    position: relative;
  }

  .drag-handle {
    opacity: 0;
    transition: opacity 0.15s ease;
    cursor: grab;
    flex-shrink: 0;
  }

  .outline-link:hover .drag-handle {
    opacity: 0.5;
  }

  .outline-link:active .drag-handle {
    cursor: grabbing;
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

  :global(.dark) .collapse-button {
    color: rgb(156 163 175);
  }

  :global(.dark) .collapse-button:hover {
    background-color: rgb(55 65 81);
    color: rgb(209 213 219);
  }
</style>
