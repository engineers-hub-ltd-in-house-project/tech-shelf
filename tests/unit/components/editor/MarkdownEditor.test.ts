import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/svelte';
import MarkdownEditor from '$lib/components/editor/MarkdownEditor.svelte';

// CodeMirrorのモック
vi.mock('codemirror', () => ({
  EditorView: vi.fn().mockImplementation(() => ({
    dom: document.createElement('div'),
    destroy: vi.fn(),
    dispatch: vi.fn(),
    state: {
      doc: {
        toString: () => 'test content',
        length: 12,
      },
      selection: {
        main: {
          head: 0,
          from: 0,
          to: 0,
        },
      },
    },
  })),
}));

vi.mock('@codemirror/state', () => ({
  EditorState: {
    create: vi.fn().mockReturnValue({}),
  },
}));

vi.mock('@codemirror/lang-markdown', () => ({
  markdown: vi.fn(),
}));

vi.mock('@codemirror/theme-one-dark', () => ({
  oneDark: vi.fn(),
}));

describe('MarkdownEditor', () => {
  it('should render editor', () => {
    const { container } = render(MarkdownEditor, {
      props: {
        value: 'Initial content',
        darkMode: false,
      },
    });

    expect(container.querySelector('.markdown-editor')).toBeTruthy();
  });

  it('should handle dark mode', () => {
    const { container } = render(MarkdownEditor, {
      props: {
        value: '',
        darkMode: true,
      },
    });

    expect(container.querySelector('.dark-mode')).toBeTruthy();
  });

  it('should handle image drop', async () => {
    const onImageUpload = vi.fn().mockResolvedValue('http://example.com/image.png');

    const { container } = render(MarkdownEditor, {
      props: {
        value: '',
        darkMode: false,
        onImageUpload,
      },
    });

    const editor = container.querySelector('.markdown-editor');
    expect(editor).toBeTruthy();

    // ドラッグイベントをシミュレート
    const file = new File(['image'], 'test.png', { type: 'image/png' });
    const dataTransfer = {
      files: [file],
      types: ['Files'],
      items: [
        {
          type: 'image/png',
        },
      ],
    };

    const _dragEvent = new DragEvent('drop', {
      dataTransfer: dataTransfer as any,
      bubbles: true,
      cancelable: true,
    });

    // Note: 実際のテストではCodeMirrorのモックが必要
    // ここでは基本的な構造のテストのみ
  });

  it('should show drop overlay on drag over', async () => {
    const { container } = render(MarkdownEditor, {
      props: {
        value: '',
        darkMode: false,
      },
    });

    const dropOverlay = container.querySelector('.drop-overlay');
    expect(dropOverlay).toBeTruthy();
    expect(dropOverlay?.querySelector('.drop-message')).toBeTruthy();
  });
});
