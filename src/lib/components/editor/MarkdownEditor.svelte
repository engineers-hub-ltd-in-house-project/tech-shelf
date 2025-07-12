<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { EditorView, basicSetup } from 'codemirror';
  import { EditorState } from '@codemirror/state';
  import { markdown } from '@codemirror/lang-markdown';
  import { oneDark } from '@codemirror/theme-one-dark';
  import { createEventDispatcher } from 'svelte';

  export let value: string = '';
  export const placeholder: string = 'Markdownで記事を書き始めましょう...';
  export let darkMode: boolean = false;

  let editorElement: HTMLDivElement;
  let view: EditorView;
  const dispatch = createEventDispatcher();

  onMount(() => {
    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newValue = update.state.doc.toString();
        value = newValue;
        dispatch('change', { value: newValue });
      }
    });

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        markdown(),
        updateListener,
        EditorView.theme({
          '&': {
            height: '100%',
            fontSize: '16px',
          },
          '.cm-content': {
            padding: '16px',
            fontFamily:
              'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          },
          '.cm-focused .cm-cursor': {
            borderLeftColor: '#528bff',
          },
          '.cm-line': {
            padding: '0 2px 0 6px',
          },
        }),
        EditorView.lineWrapping,
        ...(darkMode ? [oneDark] : []),
      ],
    });

    view = new EditorView({
      state,
      parent: editorElement,
    });

    return () => {
      view?.destroy();
    };
  });

  onDestroy(() => {
    view?.destroy();
  });

  export function focus() {
    view?.focus();
  }

  export function getSelection() {
    if (!view) return '';
    const state = view.state;
    const { from, to } = state.selection.main;
    return state.doc.sliceString(from, to);
  }

  export function replaceSelection(text: string) {
    if (!view) return;
    view.dispatch({
      changes: {
        from: view.state.selection.main.from,
        to: view.state.selection.main.to,
        insert: text,
      },
    });
  }

  export function insertAtCursor(text: string) {
    if (!view) return;
    const pos = view.state.selection.main.head;
    view.dispatch({
      changes: { from: pos, to: pos, insert: text },
      selection: { anchor: pos + text.length },
    });
  }
</script>

<div bind:this={editorElement} class="markdown-editor" class:dark-mode={darkMode}></div>

<style>
  .markdown-editor {
    height: 100%;
    width: 100%;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: white;
  }

  .dark-mode {
    border-color: rgb(55 65 81);
  }

  :global(.cm-editor) {
    height: 100%;
  }

  :global(.cm-editor.cm-focused) {
    outline: none;
  }

  :global(.cm-scroller) {
    font-family:
      ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
  }
</style>
