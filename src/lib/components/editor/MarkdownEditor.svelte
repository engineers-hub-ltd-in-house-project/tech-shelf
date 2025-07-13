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
  export let onImageUpload: ((_file: File) => Promise<string>) | undefined = undefined;

  let editorElement: HTMLDivElement;
  let view: EditorView;
  let dragCounter = 0;
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

    // ドラッグ&ドロップのイベントリスナーを追加
    const editorDom = view.dom;
    editorDom.addEventListener('dragenter', handleDragEnter);
    editorDom.addEventListener('dragleave', handleDragLeave);
    editorDom.addEventListener('dragover', handleDragOver);
    editorDom.addEventListener('drop', handleDrop);

    return () => {
      editorDom.removeEventListener('dragenter', handleDragEnter);
      editorDom.removeEventListener('dragleave', handleDragLeave);
      editorDom.removeEventListener('dragover', handleDragOver);
      editorDom.removeEventListener('drop', handleDrop);
      view?.destroy();
    };
  });

  onDestroy(() => {
    view?.destroy();
  });

  function handleDragEnter(e: DragEvent) {
    e.preventDefault();
    dragCounter++;
    if (dragCounter === 1 && isImageFile(e)) {
      editorElement.classList.add('drag-over');
    }
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) {
      editorElement.classList.remove('drag-over');
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (isImageFile(e)) {
      e.dataTransfer!.dropEffect = 'copy';
    }
  }

  async function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragCounter = 0;
    editorElement.classList.remove('drag-over');

    const files = Array.from(e.dataTransfer?.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));

    if (imageFiles.length === 0) return;

    for (const file of imageFiles) {
      await insertImage(file);
    }
  }

  function isImageFile(e: DragEvent): boolean {
    if (!e.dataTransfer) return false;

    if (e.dataTransfer.types.includes('Files')) {
      const items = e.dataTransfer.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i]?.type.startsWith('image/')) {
            return true;
          }
        }
      }
    }
    return false;
  }

  async function insertImage(file: File) {
    if (!onImageUpload) {
      // onImageUploadが定義されていない場合は、ローカルでBase64変換
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        const markdown = `![${file.name}](${base64})`;
        insertAtCursor(markdown);
      };
      reader.readAsDataURL(file);
      return;
    }

    // プレースホルダーを挿入
    const placeholder = `![アップロード中: ${file.name}](...)`;
    insertAtCursor(placeholder);

    try {
      // 画像をアップロード
      const imageUrl = await onImageUpload(file);

      // プレースホルダーを実際のURLに置換
      const currentValue = view.state.doc.toString();
      const newValue = currentValue.replace(placeholder, `![${file.name}](${imageUrl})`);

      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newValue,
        },
      });
    } catch (error) {
      // エラーの場合はプレースホルダーを削除
      const currentValue = view.state.doc.toString();
      const newValue = currentValue.replace(placeholder, '');

      view.dispatch({
        changes: {
          from: 0,
          to: view.state.doc.length,
          insert: newValue,
        },
      });

      console.error('画像のアップロードに失敗しました:', error);
      alert('画像のアップロードに失敗しました');
    }
  }

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

<div bind:this={editorElement} class="markdown-editor" class:dark-mode={darkMode}>
  <div class="drop-overlay">
    <div class="drop-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
      <p>画像をドロップしてアップロード</p>
    </div>
  </div>
</div>

<style>
  .markdown-editor {
    height: 100%;
    width: 100%;
    border: 1px solid rgb(229 231 235);
    border-radius: 0.375rem;
    overflow: hidden;
    background-color: white;
    position: relative;
  }

  .dark-mode {
    border-color: rgb(55 65 81);
  }

  .drop-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(59, 130, 246, 0.1);
    border: 2px dashed rgb(59, 130, 246);
    display: none;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .markdown-editor.drag-over .drop-overlay {
    display: flex;
  }

  .drop-message {
    text-align: center;
    color: rgb(59, 130, 246);
  }

  .drop-message svg {
    margin: 0 auto 1rem;
  }

  .drop-message p {
    font-size: 1.125rem;
    font-weight: 500;
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
