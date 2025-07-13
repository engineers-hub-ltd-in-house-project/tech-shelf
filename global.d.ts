/// <reference types="svelte" />
/// <reference types="vite/client" />

// Svelte DnD Action types
declare module 'svelte-dnd-action' {
  export interface DndEvent<T = unknown> {
    items: T[];
    info: {
      trigger: string;
      id: string;
      source: string;
    };
  }

  export interface Options {
    items: unknown[];
    flipDurationMs?: number;
    dropTargetStyle?: Record<string, string>;
  }

  export function dndzone(
    element: HTMLElement,
    options: Options
  ): {
    update(options: Options): void;
    destroy(): void;
  };
}

// Browser globals
declare global {
  interface Window {
    alert: (message: string) => void;
  }

  const alert: (message: string) => void;
  const Buffer: typeof import('buffer').Buffer;
  const File: typeof globalThis.File;
  const FileReader: typeof globalThis.FileReader;
  const DragEvent: typeof globalThis.DragEvent;
}
